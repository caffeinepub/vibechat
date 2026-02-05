import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useCheckPhoneNumberAvailability } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { readFileAsBytes } from '../utils/fileBytes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ProfilePhotoPicker } from './ProfilePhotoPicker';

interface WhatsAppStyleAuthProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthStep = 'phone' | 'verify' | 'profile';

export function WhatsAppStyleAuth({ open, onOpenChange }: WhatsAppStyleAuthProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();
  const checkPhoneMutation = useCheckPhoneNumberAvailability();

  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Load existing profile data if editing
  useEffect(() => {
    if (userProfile && open) {
      setFullName(userProfile.fullName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      if (userProfile.profilePicture) {
        setPreviewUrl(userProfile.profilePicture.getDirectURL());
      }
      // If user has profile, go directly to profile edit step
      setStep('profile');
    } else if (open && !userProfile && !isAuthenticated) {
      // New user flow starts with phone
      setStep('phone');
    }
  }, [userProfile, open, isAuthenticated]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        if (!userProfile) {
          setStep('phone');
          setPhoneNumber('');
          setFullName('');
          setSelectedFile(null);
          setPreviewUrl(null);
        }
        setUploadProgress(0);
      }, 300);
    }
  }, [open, userProfile]);

  const handlePhoneSubmit = async () => {
    const trimmedPhone = phoneNumber.trim();
    
    if (!trimmedPhone) {
      toast.error('Please enter your phone number');
      return;
    }

    // Basic phone validation
    if (trimmedPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsCheckingPhone(true);
    try {
      const isAvailable = await checkPhoneMutation.mutateAsync(trimmedPhone);
      if (!isAvailable) {
        toast.error('This phone number is already registered');
        setIsCheckingPhone(false);
        return;
      }
      setIsCheckingPhone(false);
      setStep('verify');
    } catch (error: any) {
      setIsCheckingPhone(false);
      toast.error('Failed to verify phone number');
    }
  };

  const handleVerify = async () => {
    try {
      await login();
      // After successful login, move to profile setup
      setStep('profile');
    } catch (error: any) {
      toast.error('Verification failed. Please try again.');
    }
  };

  const handleFileSelected = (file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const handleProfileSubmit = async () => {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      toast.error('Please enter your name');
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error('Phone number is required');
      return;
    }

    try {
      let profilePicture: ExternalBlob | undefined = userProfile?.profilePicture;

      if (selectedFile) {
        const bytes = await readFileAsBytes(selectedFile);
        profilePicture = ExternalBlob.fromBytes(bytes as Uint8Array<ArrayBuffer>).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await saveMutation.mutateAsync({
        fullName: trimmedName,
        phoneNumber: phoneNumber.trim(),
        profilePicture,
      });

      toast.success(userProfile ? 'Profile updated successfully!' : 'Welcome to Vibechat!');
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
      setUploadProgress(0);
    }
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('phone');
    } else if (step === 'profile' && !userProfile) {
      setStep('verify');
    }
  };

  const canGoBack = (step === 'verify' || (step === 'profile' && !userProfile));

  const isSaving = saveMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {canGoBack && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2"
                onClick={handleBack}
                disabled={isLoggingIn || isSaving}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <DialogTitle>
                {step === 'phone' && 'Enter your phone number'}
                {step === 'verify' && 'Verify your identity'}
                {step === 'profile' && (userProfile ? 'Edit Profile' : 'Profile info')}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription>
            {step === 'phone' && 'Vibechat will send a verification to authenticate your account'}
            {step === 'verify' && 'Click below to verify your identity securely'}
            {step === 'profile' && 'Please provide your name and an optional profile photo'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Step 1: Phone Number */}
          {step === 'phone' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isCheckingPhone}
                  className="text-lg h-12"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePhoneSubmit();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your phone number with country code
                </p>
              </div>

              <Button
                onClick={handlePhoneSubmit}
                disabled={isCheckingPhone || !phoneNumber.trim()}
                className="w-full h-11 text-base"
              >
                {isCheckingPhone ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Verify Identity */}
          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We'll verify your identity using secure authentication
                  </p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-2 rounded-md inline-block">
                    {phoneNumber}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleVerify}
                disabled={isLoggingIn}
                className="w-full h-11 text-base gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Verify Identity
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 3: Profile Setup */}
          {step === 'profile' && (profileLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">Loading...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Profile Picture Picker */}
              <ProfilePhotoPicker
                previewUrl={previewUrl}
                fullName={fullName}
                onFileSelected={handleFileSelected}
                disabled={isSaving}
              />

              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSaving}
                  className="text-lg h-12"
                  autoFocus={!userProfile}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleProfileSubmit();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  This name will be visible to your contacts
                </p>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="text-primary font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleProfileSubmit}
                disabled={isSaving || !fullName.trim()}
                className="w-full h-11 text-base"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  userProfile ? 'Save' : 'Continue'
                )}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
