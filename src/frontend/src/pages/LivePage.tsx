import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio } from 'lucide-react';

export function LivePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-2">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Radio className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Live</CardTitle>
          <CardDescription className="text-lg">
            Live is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Connect with friends and communities through live audio and video broadcasts. This feature is on its way!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
