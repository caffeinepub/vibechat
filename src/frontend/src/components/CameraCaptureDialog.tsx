import { useEffect } from 'react';
import { useCamera } from '../camera/useCamera';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Camera, Loader2, AlertCircle, RotateCw, Upload } from 'lucide-react';

interface CameraCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
}

export function CameraCaptureDialog({
  open,
  onOpenChange,
  onCapture,
}: CameraCaptureDialogProps) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.9,
    format: 'image/jpeg',
  });

  // Start camera when dialog opens
  useEffect(() => {
    if (open && isSupported) {
      startCamera();
    }
    return () => {
      if (open) {
        stopCamera();
      }
    };
  }, [open, isSupported]);

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      onCapture(file);
      stopCamera();
    }
  };

  const handleClose = () => {
    stopCamera();
    onOpenChange(false);
  };

  const handleSwitchCamera = async () => {
    await switchCamera();
  };

  const handleRetry = async () => {
    await retry();
  };

  const getErrorMessage = () => {
    if (!error) return null;

    switch (error.type) {
      case 'permission':
        return 'Camera access was denied. Please allow camera access in your browser settings and try again.';
      case 'not-supported':
        return 'Camera is not supported in your browser. Please use the gallery option instead.';
      case 'not-found':
        return 'No camera was found on your device. Please use the gallery option instead.';
      case 'unknown':
        return 'An error occurred while accessing the camera. Please try again or use the gallery option.';
      default:
        return 'An error occurred while accessing the camera. Please try again or use the gallery option.';
    }
  };

  // Check if we're on desktop (only environment camera works)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Take a photo</DialogTitle>
          <DialogDescription>
            Position yourself in the frame and tap the capture button
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Camera not supported */}
          {isSupported === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Camera is not supported in your browser. Please use the gallery option to select a photo instead.
              </AlertDescription>
            </Alert>
          )}

          {/* Camera error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage()}</AlertDescription>
            </Alert>
          )}

          {/* Camera preview */}
          {isSupported !== false && (
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: isActive ? 'block' : 'none' }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Starting camera...</p>
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {error && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center text-white px-4">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 text-destructive" />
                    <p className="text-sm mb-4">{getErrorMessage()}</p>
                    <Button
                      onClick={handleRetry}
                      variant="secondary"
                      size="sm"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {isSupported !== false && !error && (
              <>
                <Button
                  onClick={handleCapture}
                  disabled={!isActive || isLoading}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>

                {!isDesktop && (
                  <Button
                    onClick={handleSwitchCamera}
                    disabled={!isActive || isLoading}
                    variant="outline"
                    size="icon"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}

            {(isSupported === false || error) && (
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Use Gallery Instead
              </Button>
            )}

            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
