import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Compass,
  ExternalLink,
  Globe2,
  MapPin,
  NotebookPen,
  Route,
  Share2,
} from 'lucide-react';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateTripDialog } from '@/app/trips/components/CreateTripDialog';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: CalendarDays,
    title: 'Plan the days',
    text: 'Build dated itinerary items with times, locations, and the context that keeps each day clear.',
  },
  {
    icon: NotebookPen,
    title: 'Keep useful notes',
    text: 'Save reminders, food ideas, booking details, and practical notes beside the trip they belong to.',
  },
  {
    icon: MapPin,
    title: 'Save places',
    text: 'Collect cafes, hotels, landmarks, addresses, and links in one calm planning workspace.',
  },
  {
    icon: Share2,
    title: 'Share when ready',
    text: 'Publish a read-only page for friends and family without exposing private planning controls.',
  },
];

const workflowSteps = [
  {
    icon: ClipboardList,
    title: 'Create',
    text: 'Start with a title, destination, travel dates, and visibility.',
  },
  {
    icon: Route,
    title: 'Organize',
    text: 'Add itinerary items, notes, and saved places as the plan takes shape.',
  },
  {
    icon: ExternalLink,
    title: 'Publish',
    text: 'Switch the trip to public and share a polished read-only page.',
  },
];

const Home = async () => {
  const session = await getServerSession(authOptions);
  const isSignedIn = Boolean(session?.user?.id);
  const workspaceCta = {
    href: isSignedIn ? '/trips' : '/auth/signin?callbackUrl=/trips',
    label: isSignedIn ? 'Open trip workspace' : 'Sign in to start planning',
  };

  return (
    <main className="bg-[radial-gradient(circle_at_6%_7%,var(--landing-radial-mint),transparent_50%),radial-gradient(circle_at_90%_12%,var(--landing-radial-sky),transparent_26%),linear-gradient(180deg,var(--landing-background-start)_0%,var(--landing-background-end)_100%)]">
      <section className="px-viewportPadding py-10 md:py-16">
        <div className="mx-auto grid w-full max-w-outerContentWidth items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="grid gap-7">
            <div>
              <p className="mb-4 text-xs font-black tracking-[0.18em] text-secondary uppercase">
                Travel planning, shared clearly
              </p>
              <h1 className="text-[clamp(54px,7vw,96px)] leading-[.92] font-black tracking-[-0.075em] text-foreground">
                Plan the trip. Keep the story.
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              A focused workspace for turning travel ideas into dated itineraries, useful notes, saved places, and more.
            </p>
            <div className="flex flex-wrap items-center gap-7">
              <Button asChild variant="gradient" size="pill">
                <Link href={workspaceCta.href}>{workspaceCta.label}</Link>
              </Button>
              {isSignedIn && (
                <CreateTripDialog
                  triggerLabel="Create a trip"
                  triggerVariant="orangeGradient"
                  triggerClassName="w-auto"
                />
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl rotate-0 rounded-4xl bg-card/80 p-4 shadow-elevationMedium sm:rotate-1">
            <div className="relative min-h-100 overflow-hidden rounded-3xl bg-emerald-950">
              <Image
                src="/homeBg.jpg"
                alt="Scenic destination landscape"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,hsl(var(--foreground)/0.18),hsl(var(--foreground)/0.72))]" />
              <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-card/85 px-3 py-2 text-xs font-black text-card-foreground shadow-elevationLow backdrop-blur-xl">
                <Compass className="size-4 text-primary" aria-hidden="true" />
                Draft
              </div>
              <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-border/70 bg-card/90 p-4 text-card-foreground shadow-elevationMedium backdrop-blur-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <strong className="text-base">Summer holidays</strong>
                  <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800">
                    Private
                  </span>
                </div>
                <div className="mt-4 grid gap-2">
                  <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl bg-background p-2">
                    <span className="rounded-xl bg-primary text-center text-[0.68rem] leading-tight font-black text-primary-foreground p-1.5">
                      AUG
                      <br />
                      11
                    </span>
                    <span>
                      <strong className="block text-sm">In pueblo</strong>
                      <span className="text-xs text-muted-foreground">Ateca · 20:00</span>
                    </span>
                    <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl bg-background p-2">
                    <span className="rounded-xl bg-primary p-1.5 py-1 text-center text-[0.68rem] leading-tight font-black text-primary-foreground">
                      AUG
                      <br />
                      12
                    </span>
                    <span>
                      <strong className="block text-sm">Eclipse viewing</strong>
                      <span className="text-xs text-muted-foreground">Saved as draft</span>
                    </span>
                    <Globe2 className="size-4 text-primary" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className=" px-viewportPadding py-16 scroll-mt-28">
        <div className="mx-auto w-full max-w-outerContentWidth">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">
              Built for the first useful version
            </p>
            <h2 className="text-4xl leading-tight font-black text-foreground md:text-5xl">
              Everything needed to get from idea to shared trip
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="grid min-h-60 gap-4 rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-elevationLow"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-mint-100 text-emerald-800 dark:bg-primary/15 dark:text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card/85 p-5 shadow-elevationLow">
            <p className="max-w-2xl text-base leading-7 font-semibold text-card-foreground">
              New to Trip Scribe? See the full workflow from first idea to shareable trip page.
            </p>
            <Button asChild variant="gradient" size="pill">
              <Link href="/how-it-works">Explore the product tour</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-viewportPadding py-16 scroll-mt-28">
        <div className="mx-auto grid w-full max-w-outerContentWidth gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">Simple workflow</p>
            <h2 className="text-4xl leading-tight font-black text-foreground md:text-5xl">Create, organize, publish</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
              Start with trip basics, add details as plans firm up, then share only the polished version when it is
              ready.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
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

      <section className="px-viewportPadding pb-20">
        <div className="mx-auto grid w-full max-w-outerContentWidth gap-8 overflow-hidden rounded-4xl border border-border bg-card p-6 shadow-elevationMedium md:grid-cols-[1fr_0.9fr] md:p-8 lg:p-10">
          <div>
            <p className="mb-3 text-xs font-black tracking-[0.18em] text-secondary uppercase">Read-only sharing</p>
            <h2 className="text-4xl leading-tight font-black text-card-foreground md:text-5xl">
              Share the trip, not the planning tools.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              Public trip pages give travelers, friends, and family a clean view of itinerary items, notes, and places
              without exposing private edits or workspace controls.
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
    </main>
  );
};

export default Home;
