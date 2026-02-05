import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Camera, Upload, User } from 'lucide-react';
import { validateImageFile } from '../utils/fileBytes';
import { toast } from 'sonner';
import { CameraCaptureDialog } from './CameraCaptureDialog';

interface ProfilePhotoPickerProps {
  previewUrl: string | null;
  fullName: string;
  onFileSelected: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}

export function ProfilePhotoPicker({
  previewUrl,
  fullName,
  onFileSelected,
  disabled = false,
}: ProfilePhotoPickerProps) {
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const url = URL.createObjectURL(file);
    onFileSelected(file, url);
  };

  const handleCameraCapture = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const url = URL.createObjectURL(file);
    onFileSelected(file, url);
    setCameraDialogOpen(false);
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
    <>
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-32 w-32">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt={fullName || 'Profile'} />
          ) : (
            <AvatarFallback className="text-3xl bg-muted">
              {fullName ? getInitials(fullName) : <User className="h-12 w-12 text-muted-foreground" />}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-3">
            <Label
              htmlFor="gallery-picker"
              className="cursor-pointer inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              <Upload className="h-4 w-4" />
              {previewUrl ? 'Choose photo' : 'From gallery'}
            </Label>
            <Input
              id="gallery-picker"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setCameraDialogOpen(true)}
              disabled={disabled}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="h-4 w-4" />
              Take photo
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Choose from your gallery or take a new photo
          </p>
        </div>
      </div>

      <CameraCaptureDialog
        open={cameraDialogOpen}
        onOpenChange={setCameraDialogOpen}
        onCapture={handleCameraCapture}
      />
    </>
  );
}
