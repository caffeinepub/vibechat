import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstallPrompt } from '@/hooks/usePWAInstallPrompt';
import { useState, useEffect } from 'react';
import { isCalloutHidden, setCalloutHidden } from '@/utils/pwaInstallCalloutStorage';

export function PWAInstallCallout() {
  const { isInstallable, promptInstall, isInstalled } = usePWAInstallPrompt();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    setIsHidden(isCalloutHidden());
  }, []);

  // Hide callout if app is installed
  useEffect(() => {
    if (isInstalled) {
      setCalloutHidden(true);
      setIsHidden(true);
    }
  }, [isInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await promptInstall();
    setIsInstalling(false);
    
    if (success) {
      // Persist hidden state and hide callout after successful install
      setCalloutHidden(true);
      setIsHidden(true);
    }
  };

  const handleNotNow = () => {
    setCalloutHidden(true);
    setIsHidden(true);
  };

  if (isHidden || isInstalled) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5 relative">
      <CardContent className="pt-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleNotNow}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">Install Vibechat</h3>
              {isInstallable ? (
                <p className="text-sm text-muted-foreground">
                  Install Vibechat on your device for quick access and a better experience.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  To install Vibechat, open your browser menu and look for "Add to Home Screen" or "Install App". Note: Installation availability depends on your browser and device.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {isInstallable ? (
                <>
                  <Button 
                    onClick={handleInstall} 
                    disabled={isInstalling}
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {isInstalling ? 'Installing...' : 'Install'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleNotNow}
                  >
                    Not now
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNotNow}
                >
                  Not now
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
