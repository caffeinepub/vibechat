import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useCreateConversation } from '../../hooks/useQueries';
import { Loader2, AlertCircle, MessageSquarePlus } from 'lucide-react';
import { Principal } from '@dfinity/principal';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

export function NewConversationDialog({ open, onOpenChange, onConversationCreated }: NewConversationDialogProps) {
  const [principalInput, setPrincipalInput] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const createConversationMutation = useCreateConversation();

  const validatePrincipal = (input: string): boolean => {
    try {
      Principal.fromText(input);
      setValidationError('');
      return true;
    } catch {
      setValidationError('Invalid Principal ID format');
      return false;
    }
  };

  const handleCreate = async () => {
    if (!principalInput.trim()) {
      setValidationError('Please enter a Principal ID');
      return;
    }

    if (!validatePrincipal(principalInput.trim())) {
      return;
    }

    try {
      const principal = Principal.fromText(principalInput.trim());
      const conversationId = await createConversationMutation.mutateAsync([principal]);
      onConversationCreated(conversationId);
      setPrincipalInput('');
      setValidationError('');
    } catch (error: any) {
      // Error is handled by the mutation
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPrincipalInput('');
      setValidationError('');
      createConversationMutation.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            Start New Chat
          </DialogTitle>
          <DialogDescription>
            Enter the Principal ID of the person you want to chat with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal ID</Label>
            <Input
              id="principal"
              placeholder="e.g., aaaaa-aa..."
              value={principalInput}
              onChange={(e) => {
                setPrincipalInput(e.target.value);
                setValidationError('');
              }}
              onBlur={() => {
                if (principalInput.trim()) {
                  validatePrincipal(principalInput.trim());
                }
              }}
              disabled={createConversationMutation.isPending}
              className="font-mono text-sm"
            />
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          {createConversationMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {createConversationMutation.error instanceof Error
                  ? createConversationMutation.error.message
                  : 'Failed to create conversation'}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleCreate}
              disabled={createConversationMutation.isPending || !principalInput.trim()}
              className="flex-1 gap-2"
            >
              {createConversationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <MessageSquarePlus className="h-4 w-4" />
                  Start Chat
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createConversationMutation.isPending}
            >
              Cancel
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>💡 Tip: You can find Principal IDs from your synced contacts</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
