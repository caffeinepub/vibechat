import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Sparkles, Info } from 'lucide-react';
import { generateSmartReplies, type SmartReply } from '../../../utils/aiSmartReplies';
import { Alert, AlertDescription } from '../../ui/alert';

interface AIHelperSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latestReceivedMessage: string | null;
  onInsertText: (text: string) => void;
}

export function AIHelperSheet({ 
  open, 
  onOpenChange, 
  latestReceivedMessage,
  onInsertText 
}: AIHelperSheetProps) {
  const suggestions: SmartReply[] = latestReceivedMessage 
    ? generateSmartReplies(latestReceivedMessage)
    : [];

  const handleSuggestionClick = (text: string) => {
    onInsertText(text);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] sm:h-auto sm:max-h-[80vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Assistant
          </SheetTitle>
          <SheetDescription>
            Get smart reply suggestions for your messages
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Disclosure */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Assistant suggestions are generated on-device using simple rules (demo). 
              No external AI services are used.
            </AlertDescription>
          </Alert>

          {/* Smart Replies Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Smart Replies</h3>
              <Badge variant="secondary" className="text-xs">On-device</Badge>
            </div>

            {latestReceivedMessage ? (
              <>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Replying to:</p>
                  <p className="text-sm line-clamp-2">{latestReceivedMessage}</p>
                </div>

                {suggestions.length > 0 ? (
                  <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                      >
                        <span className="text-sm">{suggestion.text}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No suggestions available for this message.
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No messages to reply to yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Smart replies will appear when you receive a message.
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
