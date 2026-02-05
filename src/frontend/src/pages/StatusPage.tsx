import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-2">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Eye className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Status</CardTitle>
          <CardDescription className="text-lg">
            Status is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Share photos, videos, and text updates that disappear after 24 hours. Coming soon to Vibechat!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
