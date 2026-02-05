import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

export function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-2">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Videos</CardTitle>
          <CardDescription className="text-lg">
            Videos is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Discover and share video content with your network. We're working hard to bring you this feature!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
