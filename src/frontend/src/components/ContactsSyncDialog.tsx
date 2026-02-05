import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, Users, UserPlus, AlertCircle, RefreshCw, Contact, MessageSquare } from 'lucide-react';
import { useMatchContacts } from '../hooks/useQueries';
import {
  isContactsPickerSupported,
  extractPhoneNumbersFromContacts,
  extractPhoneNumbers,
} from '../utils/phoneNumbers';
import type { UserProfile } from '../backend';

interface ContactsSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat?: () => void;
}

export function ContactsSyncDialog({ open, onOpenChange, onStartChat }: ContactsSyncDialogProps) {
  const [manualInput, setManualInput] = useState('');
  const [matchedUsers, setMatchedUsers] = useState<UserProfile[]>([]);
  const [notFoundCount, setNotFoundCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  
  const matchContactsMutation = useMatchContacts();
  const isContactsSupported = isContactsPickerSupported();

  const handlePickContacts = async () => {
    try {
      // @ts-ignore - Contacts Picker API types
      const contacts = await navigator.contacts.select(['tel'], { multiple: true });
      const phoneNumbers = extractPhoneNumbersFromContacts(contacts);
      
      if (phoneNumbers.length === 0) {
        return;
      }

      const result = await matchContactsMutation.mutateAsync(phoneNumbers);
      setMatchedUsers(result);
      setNotFoundCount(phoneNumbers.length - result.length);
      setHasSearched(true);
    } catch (error: any) {
      console.error('Error picking contacts:', error);
      // User cancelled or permission denied - silently handle
    }
  };

  const handleManualSync = async () => {
    const phoneNumbers = extractPhoneNumbers(manualInput);
    
    if (phoneNumbers.length === 0) {
      return;
    }

    const result = await matchContactsMutation.mutateAsync(phoneNumbers);
    setMatchedUsers(result);
    setNotFoundCount(phoneNumbers.length - result.length);
    setHasSearched(true);
  };

  const handleResync = () => {
    setMatchedUsers([]);
    setNotFoundCount(0);
    setHasSearched(false);
    setManualInput('');
    matchContactsMutation.reset();
  };

  const handleStartChatWithContact = () => {
    if (onStartChat) {
      onStartChat();
      onOpenChange(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Contact className="h-5 w-5" />
            Find Contacts on Vibechat
          </DialogTitle>
          <DialogDescription>
            Contacts are used only to find which contacts are on Vibechat. Your contact information is never stored or shared.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!hasSearched ? (
            <>
              {/* Contacts Picker Option */}
              {isContactsSupported && (
                <div className="space-y-3">
                  <Button
                    onClick={handlePickContacts}
                    disabled={matchContactsMutation.isPending}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {matchContactsMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Matching contacts...
                      </>
                    ) : (
                      <>
                        <Users className="h-5 w-5" />
                        Pick Contacts
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Select contacts from your device to find who's on Vibechat
                  </p>
                </div>
              )}

              {/* Manual Input Fallback */}
              <div className="space-y-3">
                {isContactsSupported && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or enter manually
                      </span>
                    </div>
                  </div>
                )}
                
                <Textarea
                  placeholder="Enter phone numbers (one per line or comma-separated)&#10;Example:&#10;+1234567890&#10;+9876543210"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                
                <Button
                  onClick={handleManualSync}
                  disabled={matchContactsMutation.isPending || !manualInput.trim()}
                  className="w-full gap-2"
                  variant="outline"
                >
                  {matchContactsMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Matching...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Find Contacts
                    </>
                  )}
                </Button>
              </div>

              {!isContactsSupported && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Contact picker is not available in your browser. Please enter phone numbers manually above.
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-4">
                {/* Matched Users */}
                {matchedUsers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        On Vibechat ({matchedUsers.length})
                      </CardTitle>
                      <CardDescription>
                        These contacts are already using Vibechat. To start a chat, go to Chats and enter their Principal ID.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {matchedUsers.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            {user.profilePicture ? (
                              <AvatarImage
                                src={user.profilePicture.getDirectURL()}
                                alt={user.fullName}
                              />
                            ) : (
                              <AvatarFallback>
                                {getInitials(user.fullName)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.phoneNumber}
                            </p>
                          </div>
                        </div>
                      ))}
                      {onStartChat && (
                        <Button
                          onClick={handleStartChatWithContact}
                          className="w-full gap-2 mt-4"
                          variant="outline"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Go to Chats
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Not Found */}
                {notFoundCount > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        Not on Vibechat ({notFoundCount})
                      </CardTitle>
                      <CardDescription>
                        These contacts haven't joined Vibechat yet
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}

                {/* No matches at all */}
                {matchedUsers.length === 0 && notFoundCount === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No contacts found. Try syncing again or check your phone numbers.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Resync Button */}
                <Button
                  onClick={handleResync}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync Again
                </Button>
              </div>
            </>
          )}

          {/* Error Display */}
          {matchContactsMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {matchContactsMutation.error instanceof Error
                  ? matchContactsMutation.error.message
                  : 'Failed to match contacts. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
