import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Link2, Zap, BarChart3, Shield, Sparkles, Clock, Check } from 'lucide-react';
import HomeClient from './home/HomeClient';
import ScrollToTop from './home/ScrollToTop';

export default async function Home(): Promise<JSX.Element> {
  const user = await currentUser();
  if (user) {
    // Authenticated users should be redirected to the dashboard per project rules
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-primary">
            <Link2 className="h-12 w-12" />
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Shorten Links.
            <br />
            <span className="text-primary">Track Performance.</span>
            <br />
            Grow Your Brand.
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Create short, memorable links that make sharing easy. Track clicks,
            analyze your audience, and optimize your content strategy—all in one place.
          </p>
          <HomeClient />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features to manage and optimize your links
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="flex flex-col items-start rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Create shortened links instantly with our optimized infrastructure.
              Share links in seconds, not minutes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Detailed Analytics</h3>
            <p className="text-muted-foreground">
              Track clicks, geographic data, and referral sources. Understand your
              audience with comprehensive insights.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Your links are protected with enterprise-grade security. 99.9% uptime
              guaranteed for peace of mind.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-start rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Custom Short Links</h3>
            <p className="text-muted-foreground">
              Create branded short links that reflect your identity. Make your links
              memorable and trustworthy.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="flex flex-col items-start rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Link Management</h3>
            <p className="text-muted-foreground">
              Organize, edit, and archive your links effortlessly. Keep your
              dashboard clean and efficient.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="flex flex-col items-start rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Simple & Intuitive</h3>
            <p className="text-muted-foreground">
              Beautiful, user-friendly interface designed for efficiency. No
              learning curve required.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl border bg-card p-8 shadow-sm md:p-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                Why Choose LinkShortener?
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                We make link management simple, powerful, and accessible for everyone.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <strong className="font-semibold">No credit card required</strong>
                    <p className="text-muted-foreground">
                      Start creating short links immediately, completely free.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <strong className="font-semibold">Real-time analytics</strong>
                    <p className="text-muted-foreground">
                      See your link performance update instantly as clicks happen.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <strong className="font-semibold">Easy collaboration</strong>
                    <p className="text-muted-foreground">
                      Share and manage links across your team effortlessly.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                {/* Note: This is illustrative marketing copy for the landing page, not real-time data */}
                <div className="mb-4 text-6xl font-bold text-primary">10K+</div>
                <p className="text-xl font-semibold">Links Created</p>
                <p className="mt-2 text-muted-foreground">
                  Join thousands of users who trust LinkShortener
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 pb-32">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Create your free account and start shortening links in seconds.
            No credit card required.
          </p>
          <HomeClient />
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
