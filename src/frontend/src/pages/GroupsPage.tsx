import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function GroupsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-2">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Groups</CardTitle>
          <CardDescription className="text-lg">
            Groups is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Create and manage group conversations with multiple participants. Stay tuned for this exciting feature!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
