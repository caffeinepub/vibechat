import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Zap, Users, Shield, CheckCircle2, XCircle, Loader2, RefreshCw, Info } from 'lucide-react';
import { usePublishReadinessCheck } from '@/hooks/useQueries';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function LandingPage() {
  const { data, isLoading, isError, error, refetch, isRefetching } = usePublishReadinessCheck();

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
          <Button size="lg" className="text-lg px-8 gap-2">
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

      {/* Publish Readiness Check Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">Publish Readiness Check</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verify that your canister is ready for production deployment
          </p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Canister Status
            </CardTitle>
            <CardDescription>
              Check the connection to your backend canister and verify deployment readiness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex items-center gap-2">
                {isLoading || isRefetching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Checking...</span>
                  </>
                ) : isError ? (
                  <>
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">Failed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-500">Ready</span>
                  </>
                )}
              </div>
            </div>

            {data && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm font-medium">Caller Principal:</span>
                  <div className="p-3 rounded-md bg-muted font-mono text-xs break-all">
                    {data.principal}
                  </div>
                </div>
              </>
            )}

            {isError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription className="text-sm">
                  {error instanceof Error ? error.message : 'Failed to connect to the backend canister. Please check your deployment.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              variant="outline"
              className="w-full gap-2"
            >
              {isLoading || isRefetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Run Check Again
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* How to Publish Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">How to Publish</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these steps to deploy your application to production
          </p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Publishing Steps</CardTitle>
            <CardDescription>
              Deploy your Vibechat application to the Internet Computer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Ensure Build Success</h3>
                  <p className="text-sm text-muted-foreground">
                    Run the publish readiness check above to verify your canister is responding correctly. Make sure there are no TypeScript or build errors.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Deploy to Production</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the deployment tools provided by your platform to push your application to production. Ensure all environment variables and canister IDs are correctly configured.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Verify Deployment</h3>
                  <p className="text-sm text-muted-foreground">
                    After deployment, visit your production URL and run the readiness check to confirm everything is working as expected.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Troubleshooting Checklist
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Build failures:</strong> Check for TypeScript errors, missing dependencies, or incorrect imports in your code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Missing assets:</strong> Verify that all images, fonts, and static files are properly included in your build output.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Canister connection issues:</strong> Ensure your canister IDs are correct and the backend is deployed before the frontend.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span><strong>Local environment:</strong> If using dfx locally, make sure your local replica is running and canisters are deployed with <code className="px-1 py-0.5 rounded bg-muted">dfx deploy</code>.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 px-4 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Ready to find your vibe?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Join thousands of users already chatting on Vibechat
        </p>
        <Button size="lg" className="text-lg px-8 gap-2">
          <MessageSquare className="h-5 w-5" />
          Start Chatting Now
        </Button>
      </section>
    </div>
  );
}
