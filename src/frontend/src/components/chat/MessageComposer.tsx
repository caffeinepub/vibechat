import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useSendMessage } from '../../hooks/useQueries';
import { Loader2, Send, Paperclip, X, Video as VideoIcon } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { toast } from 'sonner';
import { readFileAsBytesAny } from '../../utils/readFileAsBytesAny';
import { ExternalBlob, MediaAttachmentType } from '../../backend';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { openWhatsAppShare } from '../../utils/whatsappShare';

interface MessageComposerProps {
  conversationId: string;
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [shareToWhatsApp, setShareToWhatsApp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sendMessageMutation = useSendMessage();

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

  const isSending = sendMessageMutation.isPending;

  return (
    <div className="border-t border-border bg-background p-4 space-y-3">
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isSending}
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />

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
