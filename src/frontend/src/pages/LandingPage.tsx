import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Zap, Users, Shield } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-block">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Connect with your vibe</span>
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
          Chat that feels{' '}
          <span className="text-primary">right</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Experience conversations that flow naturally. Vibechat brings people together
          with intuitive, real-time messaging built for the way you communicate.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="text-lg px-8 gap-2" onClick={onOpenAuth}>
            <MessageSquare className="h-5 w-5" />
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">Why Vibechat?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with the features that matter most for modern communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Instant Messaging</CardTitle>
              <CardDescription>
                Real-time conversations that keep you connected with lightning-fast delivery
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Group Chats</CardTitle>
              <CardDescription>
                Create spaces for teams, friends, and communities to collaborate seamlessly
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your conversations are protected with end-to-end encryption and privacy controls
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 px-4 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Ready to find your vibe?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Join thousands of users already chatting on Vibechat
        </p>
        <Button size="lg" className="text-lg px-8 gap-2" onClick={onOpenAuth}>
          <MessageSquare className="h-5 w-5" />
          Start Chatting Now
        </Button>
      </section>
    </div>
  );
}
