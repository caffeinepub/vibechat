import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { SponsoredVideoItem } from './mockSponsoredItems';
import { useSimulatedPlaybackProgress } from './useSimulatedPlaybackProgress';
import { useEffect, useState } from 'react';

interface SponsoredVideoViewerProps {
  item: SponsoredVideoItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SponsoredVideoViewer({ item, open, onOpenChange }: SponsoredVideoViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const { progress, reset } = useSimulatedPlaybackProgress({
    duration: item?.duration || 10,
    isPlaying,
    onComplete: () => {
      setIsPlaying(false);
    },
  });

  useEffect(() => {
    if (open && item) {
      reset();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      reset();
    }
  }, [open, item, reset]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2 bg-yellow-500/90 text-black hover:bg-yellow-500">
                Sponsored
              </Badge>
              <DialogTitle className="text-white text-lg">{item.title}</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20 -mt-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="relative aspect-[9/16] bg-black">
          <img
            src={item.thumbnailPath}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="h-1" />
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>{Math.round(progress)}%</span>
                <span>{item.duration}s</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
