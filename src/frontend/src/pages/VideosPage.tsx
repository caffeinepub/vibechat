import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { SponsoredVideoFeed } from '@/components/videos/SponsoredVideoFeed';

export function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="text-muted-foreground">
            Discover sponsored content and video recommendations
          </p>
        </div>

        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            Demo sponsored content for preview purposes. These are sample advertisements to showcase the video feed experience.
          </AlertDescription>
        </Alert>

        <SponsoredVideoFeed />
      </div>
    </div>
  );
}
