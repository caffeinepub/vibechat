import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useSendMessage, useGetMessages } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Loader2, Send, Paperclip, X, Video as VideoIcon, Sparkles, Wand2 } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { toast } from 'sonner';
import { readFileAsBytesAny } from '../../utils/readFileAsBytesAny';
import { ExternalBlob, MediaAttachmentType } from '../../backend';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { openWhatsAppShare } from '../../utils/whatsappShare';
import { generateSmartReplies, type SmartReply } from '../../utils/aiSmartReplies';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { rewriteText, getRewriteModeLabel, type RewriteMode } from '../../utils/aiRewrite';
import { Separator } from '../ui/separator';

interface MessageComposerProps {
  conversationId: string;
  externalText?: string;
  onExternalTextUsed?: () => void;
}

export const MessageComposer = forwardRef<{ insertText: (text: string) => void }, MessageComposerProps>(
  ({ conversationId, externalText, onExternalTextUsed }, ref) => {
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [shareToWhatsApp, setShareToWhatsApp] = useState(false);
    const [rewriteOpen, setRewriteOpen] = useState(false);
    const [rewritePreview, setRewritePreview] = useState<string>('');
    const [selectedMode, setSelectedMode] = useState<RewriteMode>('friendly');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const sendMessageMutation = useSendMessage();
    const { data: messages } = useGetMessages(conversationId);
    const { identity } = useInternetIdentity();

    // Handle external text insertion
    useEffect(() => {
      if (externalText) {
        setText(externalText);
        onExternalTextUsed?.();
        textareaRef.current?.focus();
      }
    }, [externalText, onExternalTextUsed]);

    // Expose insertText method via ref
    useImperativeHandle(ref, () => ({
      insertText: (newText: string) => {
        setText(newText);
        textareaRef.current?.focus();
      },
    }));

    // Get latest received message for smart replies
    const currentUserPrincipal = identity?.getPrincipal().toString();
    const latestReceivedMessage = messages
      ?.filter(m => m.sender.toString() !== currentUserPrincipal)
      .slice(-1)[0]?.text || null;

    const smartReplies: SmartReply[] = latestReceivedMessage 
      ? generateSmartReplies(latestReceivedMessage).slice(0, 3)
      : [];

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        return isImage || isVideo;
      });

      if (validFiles.length !== files.length) {
        toast.error('Only images and videos are supported');
      }

      setAttachments(prev => [...prev, ...validFiles]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const removeAttachment = (index: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
      if (!text.trim() && attachments.length === 0) {
        return;
      }

      // Check if WhatsApp sharing is enabled but no text
      if (shareToWhatsApp && !text.trim()) {
        toast.error('WhatsApp sharing requires text. Please add a message.');
        return;
      }

      // Warn about media attachments if WhatsApp sharing is enabled
      if (shareToWhatsApp && attachments.length > 0) {
        toast.info('WhatsApp sharing from Vibechat supports text only. Media will be sent to Vibechat only.');
      }

      try {
        const mediaAttachments = await Promise.all(
          attachments.map(async (file) => {
            const bytes = await readFileAsBytesAny(file);
            const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
              setUploadProgress(percentage);
            });
            
            const attachmentType = file.type.startsWith('image/') 
              ? MediaAttachmentType.photo 
              : MediaAttachmentType.video;
            
            return {
              blob,
              attachmentType,
            };
          })
        );

        await sendMessageMutation.mutateAsync({
          conversationId,
          text: text.trim(),
          attachments: mediaAttachments,
        });

        // After successful send, open WhatsApp share if enabled and text exists
        if (shareToWhatsApp && text.trim()) {
          openWhatsAppShare(text.trim());
        }

        setText('');
        setAttachments([]);
        setUploadProgress(0);
      } catch (error: any) {
        toast.error(error.message || 'Failed to send message');
        // Don't open WhatsApp if send failed
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleSmartReplyClick = (replyText: string) => {
      setText(replyText);
      textareaRef.current?.focus();
    };

    const handleRewriteClick = (mode: RewriteMode) => {
      setSelectedMode(mode);
      const rewritten = rewriteText(text, mode);
      setRewritePreview(rewritten);
    };

    const handleApplyRewrite = () => {
      setText(rewritePreview);
      setRewriteOpen(false);
      setRewritePreview('');
      textareaRef.current?.focus();
    };

    const handleCancelRewrite = () => {
      setRewriteOpen(false);
      setRewritePreview('');
    };

    const isSending = sendMessageMutation.isPending;
    const hasText = text.trim().length > 0;

    return (
      <div className="border-t border-border bg-background p-4 space-y-3">
        {/* AI Smart Replies */}
        {smartReplies.length > 0 && !hasText && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">
                AI suggestions (on-device demo)
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {smartReplies.map((reply) => (
                <Button
                  key={reply.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSmartReplyClick(reply.text)}
                  className="text-xs h-auto py-1.5 px-3"
                >
                  {reply.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {attachments.map((file, idx) => (
              <div key={idx} className="relative group">
                <div className="h-20 w-20 rounded-lg border border-border overflow-hidden bg-muted flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <VideoIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        {isSending && uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-1">
            <Progress value={uploadProgress} className="h-1" />
            <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
          </div>
        )}

        {/* WhatsApp Share Toggle */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="whatsapp-share"
            checked={shareToWhatsApp}
            onCheckedChange={(checked) => setShareToWhatsApp(checked === true)}
            disabled={isSending}
          />
          <Label
            htmlFor="whatsapp-share"
            className="text-sm font-normal cursor-pointer flex items-center gap-1.5"
          >
            <SiWhatsapp className="h-4 w-4 text-[#25D366]" />
            Also share to WhatsApp
          </Label>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className="shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isSending}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />

          {/* Rewrite Button */}
          {hasText && (
            <Popover open={rewriteOpen} onOpenChange={setRewriteOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSending}
                  className="shrink-0"
                >
                  <Wand2 className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      <h4 className="font-semibold text-sm">Rewrite</h4>
                      <Badge variant="secondary" className="text-xs">On-device</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rewrite suggestions are generated on-device (demo)
                    </p>
                  </div>

                  <Separator />

                  {!rewritePreview ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Choose a style:</p>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleRewriteClick('shorter')}
                        >
                          {getRewriteModeLabel('shorter')}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleRewriteClick('friendly')}
                        >
                          {getRewriteModeLabel('friendly')}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleRewriteClick('formal')}
                        >
                          {getRewriteModeLabel('formal')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Original:</p>
                        <div className="p-2 bg-muted rounded text-sm">
                          {text}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {getRewriteModeLabel(selectedMode)}:
                        </p>
                        <div className="p-2 bg-primary/10 rounded text-sm">
                          {rewritePreview}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelRewrite}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleApplyRewrite}
                          className="flex-1"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Button
            onClick={handleSend}
            disabled={isSending || (!text.trim() && attachments.length === 0)}
            size="icon"
            className="shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    );
  }
);

MessageComposer.displayName = 'MessageComposer';
