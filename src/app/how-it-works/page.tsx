import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Globe2,
  Lightbulb,
  Link2,
  Lock,
  MapPin,
  NotebookPen,
  Route,
  Share2,
  Sparkles,
} from 'lucide-react';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How Trip Scribe works | Trip Scribe',
  description:
    'See how Trip Scribe helps travelers create trips, organize itinerary items, save notes and places, and publish read-only trip pages.',
};

const painPoints = [
  {
    icon: Link2,
    title: 'Details get scattered',
    text: 'Travel ideas often live across messages, links, screenshots, and documents.',
  },
  {
    icon: NotebookPen,
    title: 'Notes lose context',
    text: 'Good ideas are easy to save, but harder to connect to the trip, day, or place they belong to.',
  },
  {
    icon: Share2,
    title: 'Sharing takes extra work',
    text: 'Private planning needs cleanup before friends or family can understand the useful version.',
  },
];

const workflowSteps = [
  {
    icon: ClipboardList,
    title: 'Create a trip',
    text: 'Add a title, destinations, travel dates, visibility, and a short description.',
  },
  {
    icon: CalendarDays,
    title: 'Add days and plans',
    text: 'Build itinerary items with times, locations, descriptions, and planning status.',
  },
  {
    icon: NotebookPen,
    title: 'Save notes and places',
    text: 'Capture reminders, booking details, cafes, landmarks, addresses, and links.',
  },
  {
    icon: Globe2,
    title: 'Publish read-only',
    text: 'Turn a public trip on when the plan is ready and share a clean page without edit controls.',
  },
];

const features = [
  {
    icon: Route,
    title: 'Itinerary timeline',
    text: 'Keep plans easy to scan by day, time, location, and status.',
  },
  {
    icon: NotebookPen,
    title: 'Trip notes',
    text: 'Store practical trip memory beside the itinerary instead of in a separate app.',
  },
  {
    icon: MapPin,
    title: 'Saved places',
    text: 'Collect addresses, categories, links, map coordinates, and why each place matters.',
  },
  {
    icon: Lock,
    title: 'Private by default',
    text: 'Plan freely before deciding what should become public.',
  },
  {
    icon: Share2,
    title: 'Public sharing',
    text: 'Create a polished read-only page for travelers, friends, or family.',
  },
  {
    icon: Sparkles,
    title: 'Clean overview',
    text: 'Keep the destination, dates, summary, status, and visibility easy to understand.',
  },
];

const HowItWorksPage = async () => {
  const session = await getServerSession(authOptions);
  const isSignedIn = Boolean(session?.user?.id);
  const workspaceCta = {
    href: isSignedIn ? '/trips' : '/auth/signin?callbackUrl=/trips',
    label: isSignedIn ? 'Open trip workspace' : 'Sign in to start planning',
  };

  return (
    <div className="bg-[radial-gradient(circle_at_6%_7%,var(--landing-radial-mint),transparent_50%),radial-gradient(circle_at_90%_12%,var(--landing-radial-sky),transparent_26%),linear-gradient(180deg,var(--landing-background-start)_0%,var(--landing-background-end)_100%)]">
      <section className="px-viewportPadding py-10 md:py-16">
        <div className="mx-auto grid w-full max-w-outerContentWidth items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="grid gap-7">
            <div>
              <p className="mb-4 text-xs font-black tracking-[0.18em] text-secondary uppercase">
                How Trip Scribe works
              </p>
              <h1 className="text-5xl leading-none font-black tracking-normal text-foreground md:text-7xl">
                From loose ideas to a trip you can share.
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              Trip Scribe keeps your itinerary, notes, places, and shareable trip page connected so planning stays clear
              from the first idea to the final version.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild variant="gradient" size="pill">
                <Link href="/trips">Start planning</Link>
              </Button>
              <Button asChild variant="orangeGradient" size="pill">
                <Link href="#workflow">View workflow</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-4xl border border-border bg-card/85 p-4 shadow-elevationMedium">
            <div className="overflow-hidden rounded-3xl border border-border bg-background">
              <div className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-secondary" aria-hidden="true" />
                  <span className="size-3 rounded-full bg-sky-500" aria-hidden="true" />
                  <span className="size-3 rounded-full bg-primary" aria-hidden="true" />
                </div>
                <span className="text-xs font-black tracking-[0.14em] text-muted-foreground uppercase">
                  Trip workspace
                </span>
              </div>
              <div className="grid gap-4 p-4 lg:grid-cols-[0.72fr_1.28fr]">
                <aside className="grid gap-3">
                  {['Overview', 'Itinerary', 'Notes', 'Places', 'Share'].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border bg-card p-3 text-sm font-black text-card-foreground shadow-xs"
                    >
                      <span className="mr-2 text-xs text-primary">0{index + 1}</span>
                      {item}
                    </div>
                  ))}
                </aside>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-emerald-950 p-5 text-white">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                      <Lock className="size-3.5" aria-hidden="true" />
                      Private draft
                    </span>
                    <h2 className="mt-4 text-3xl leading-tight font-black">Summer holidays in Madrid</h2>
                    <p className="mt-2 text-sm text-white/75">Madrid · Aug 10 to Aug 19 · Ready to organize</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">2 itinerary items</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">3 notes</span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">4 places</span>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <span className="text-xs font-black tracking-[0.14em] text-secondary uppercase">Next plan</span>
                      <h3 className="mt-2 text-lg font-black text-card-foreground">Tapas night</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Aug 11 · La Latina · 20:00</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <span className="text-xs font-black tracking-[0.14em] text-secondary uppercase">Saved place</span>
                      <h3 className="mt-2 text-lg font-black text-card-foreground">Rooftop viewpoint</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Add to public preview later.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-viewportPadding py-16">
        <div className="mx-auto grid w-full max-w-outerContentWidth gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">The problem</p>
            <h2 className="text-4xl leading-tight font-black tracking-normal text-foreground md:text-5xl">
              Travel plans get messy fast.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
              Flights, ideas, links, notes, places, and must-do moments usually spread across too many tools before the
              trip even starts.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {painPoints.map((point) => {
              const Icon = point.icon;

              return (
                <article key={point.title} className="rounded-3xl border border-border bg-card p-6 shadow-elevationLow">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-mint-100 text-emerald-800 dark:bg-primary/15 dark:text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-card-foreground">{point.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-viewportPadding py-16">
        <div className="mx-auto grid w-full max-w-outerContentWidth gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">The solution</p>
            <h2 className="text-4xl leading-tight font-black tracking-normal text-foreground md:text-5xl">
              One workspace from first idea to final itinerary.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Trip Scribe keeps the practical details together so you can plan clearly, revise quickly, and share only
              what matters.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                'Put plans, notes, and saved places in the same trip.',
                'Keep private drafts separate from the public page.',
                'Publish a read-only version when the trip is ready.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-base font-semibold text-foreground">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-elevationLow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-black tracking-[0.14em] text-secondary uppercase">Trip overview</span>
                  <h3 className="mt-2 text-2xl font-black text-card-foreground">Madrid in August</h3>
                </div>
                <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800">
                  Organizing
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {['Itinerary', 'Notes', 'Places'].map((item, index) => (
                  <div key={item} className="rounded-2xl bg-background p-4">
                    <span className="text-2xl font-black text-primary">{index + 2}</span>
                    <p className="mt-1 text-sm font-black text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-elevationLow">
              <span className="text-xs font-black tracking-[0.14em] text-secondary uppercase">Trip memory</span>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-background p-4">
                  <h3 className="font-black text-foreground">Food note</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Find a good jamon spot near the evening walk.
                  </p>
                </div>
                <div className="rounded-2xl bg-background p-4">
                  <h3 className="font-black text-foreground">Saved place</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Rooftop viewpoint with context for the public page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="px-viewportPadding py-16 scroll-mt-28">
        <div className="mx-auto w-full max-w-outerContentWidth">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">Workflow</p>
            <h2 className="text-4xl leading-tight font-black tracking-normal text-foreground md:text-5xl">
              A simple flow for planning without losing detail.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article key={step.title} className="rounded-3xl border border-border bg-card p-6 shadow-elevationLow">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-black text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-card-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="px-viewportPadding py-16 scroll-mt-28">
        <div className="mx-auto w-full max-w-outerContentWidth">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">Features</p>
              <h2 className="text-4xl leading-tight font-black tracking-normal text-foreground md:text-5xl">
                Everything your trip plan needs, without the noise.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="grid min-h-52 gap-4 rounded-3xl border border-border bg-card p-5 shadow-elevationLow"
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-mint-100 text-emerald-800 dark:bg-primary/15 dark:text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-card-foreground">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="sharing" className="px-viewportPadding py-16 scroll-mt-28">
        <div className="mx-auto grid w-full max-w-outerContentWidth gap-8 overflow-hidden rounded-4xl border border-border bg-card p-6 shadow-elevationMedium md:grid-cols-[1fr_0.9fr] md:p-8 lg:p-10">
          <div>
            <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">Read-only sharing</p>
            <h2 className="text-4xl leading-tight font-black tracking-normal text-card-foreground md:text-5xl">
              Share the trip, not the planning tools.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Public trip pages show the useful version of the itinerary, notes, and places without exposing private
              edits or workspace controls.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="gradient" size="pill">
                <Link href={workspaceCta.href}>{workspaceCta.label}</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 rounded-3xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-card p-4">
              <span>
                <strong className="block text-sm text-card-foreground">Public page</strong>
                <span className="text-xs text-muted-foreground">Read-only itinerary preview</span>
              </span>
              <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800">Shared</span>
            </div>
            <div className="grid gap-2 rounded-2xl bg-card p-4">
              <span className="text-xs font-black tracking-[0.14em] text-secondary uppercase">Included</span>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                Itinerary items
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <NotebookPen className="size-4 text-primary" aria-hidden="true" />
                Trip notes
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                Saved places
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-viewportPadding py-16">
        <div className="mx-auto grid w-full max-w-outerContentWidth gap-6 rounded-4xl border border-border bg-emerald-950 p-6 text-white shadow-elevationMedium md:grid-cols-[1fr_auto] md:items-center md:p-8 lg:p-10">
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
              <Lightbulb className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-4xl leading-tight font-black tracking-normal md:text-5xl">
              Start your next trip with a cleaner plan.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
              Create the trip, add the first few ideas, and let the itinerary take shape as details become clear.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild variant="orangeGradient" size="pill">
              <Link href="/trips">Start planning</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
