import Image from 'next/image';
import { CalendarDays, Clock, ExternalLink, Globe2, MapPin, NotebookPen, Route, UserRound } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { getPlanningStatusOption } from '@/lib/tripPlanningStatus';
import { tripInclude } from '@/lib/tripServer';

const formatTripDate = (value: Date) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatDateBadge = (value: Date | null) => {
  if (!value) {
    return 'TBD';
  }

  return new Date(value)
    .toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase()
    .replace(' ', '\n');
};

const formatTimeRange = (startsAt: Date | null, endsAt: Date | null) => {
  if (!startsAt && !endsAt) {
    return 'Time to be announced';
  }

  const formatTime = (value: Date) =>
    new Date(value).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });

  if (startsAt && endsAt) {
    return `${formatTime(startsAt)} - ${formatTime(endsAt)}`;
  }

  return startsAt ? formatTime(startsAt) : `Ends ${formatTime(endsAt as Date)}`;
};

const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

const PublicTripPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: tripInclude,
  });

  if (!trip || trip.visibility !== 'PUBLIC') {
    notFound();
  }

  const planningStatus = getPlanningStatusOption(trip.planningStatus);
  const StatusIcon = planningStatus.Icon;
  const dateRange = `${formatTripDate(trip.startDate)} - ${formatTripDate(trip.endDate)}`;
  const itemCount = trip.itineraryItems.length;
  const noteCount = trip.notes.length;
  const placeCount = trip.places.length;

  return (
    <main className="mx-auto flex w-full max-w-outerContentWidth flex-col gap-8 px-viewportPadding py-10 lg:py-12">
      <section className="relative isolate overflow-hidden rounded-4xl border border-border/80 bg-card shadow-elevationMedium">
        <Image
          // TODO: replace by a trip-specific image if available, otherwise use a default image - user added or found somewhere
          src="/pics/pexels-fotodruk-38448178.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 80rem, 100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,hsl(175_65%_7%/0.92),hsl(175_65%_7%/0.72)_48%,hsl(175_65%_7%/0.3))]" />
        <div className="grid min-h-128 content-end gap-8 p-6 text-white md:p-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:p-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-mint-100 uppercase">
                <Globe2 className="size-4" aria-hidden="true" />
                Shared Trip Scribe
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-black text-white shadow-xs backdrop-blur">
                <StatusIcon className="size-4" aria-hidden="true" />
                {planningStatus.label}
              </span>
            </div>

            <h1 className="mt-4 max-w-4xl text-4xl leading-none font-black tracking-normal md:text-6xl">
              {trip.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-base font-semibold text-white/90 md:text-lg">
              <span>{trip.destinations.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-5 text-mint-100" aria-hidden="true" />
                {dateRange}
              </span>
            </div>
            {trip.description ? (
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/80">{trip.description}</p>
            ) : null}
          </div>

          <aside className="grid gap-3 rounded-3xl border border-white/20 bg-white/15 p-4 shadow-elevationLow backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
              <UserRound className="size-5 text-mint-100" aria-hidden="true" />
              <div>
                <p className="text-xs font-black tracking-[0.14em] text-white/65 uppercase">Curated by</p>
                <p className="font-black">{trip.user.name || 'Trip Scribe traveler'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <b className="block text-2xl leading-none font-black">{itemCount}</b>
                <span className="mt-1 block text-xs font-bold text-white/70">Stops</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <b className="block text-2xl leading-none font-black">{placeCount}</b>
                <span className="mt-1 block text-xs font-bold text-white/70">Places</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <b className="block text-2xl leading-none font-black">{noteCount}</b>
                <span className="mt-1 block text-xs font-bold text-white/70">Notes</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(21rem,0.65fr)]">
        <article className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationLow backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-secondary uppercase">Timeline</p>
              <h2 className="mt-2 flex items-center gap-2 text-2xl font-black tracking-normal text-card-foreground">
                <Route className="size-6 text-primary" aria-hidden="true" />
                Itinerary
              </h2>
            </div>
            <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-primary/15 dark:text-primary">
              {pluralize(itemCount, 'planned stop')}
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            {trip.itineraryItems.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border bg-muted/70 p-5 text-sm font-semibold text-muted-foreground">
                No itinerary items have been shared yet.
              </p>
            ) : null}
            {trip.itineraryItems.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-3xl border border-border/80 bg-background/70 p-4 shadow-xs sm:grid-cols-[4.75rem_1fr] sm:items-center"
              >
                <span className="grid size-14 place-items-center whitespace-pre-line rounded-2xl bg-[linear-gradient(135deg,var(--button-primary-gradient-from),var(--button-primary-gradient-to))] text-center text-xs leading-tight font-black text-white shadow-[0_14px_30px_var(--button-primary-shadow)]">
                  {formatDateBadge(item.startsAt)}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0 text-xl font-black tracking-normal text-foreground">{item.title}</h3>
                  {item.location ? (
                    <p className="mt-1 text-base font-medium text-muted-foreground">{item.location}</p>
                  ) : null}
                  <p className="mt-1 inline-flex items-center gap-2 text-sm font-black text-muted-foreground">
                    <Clock className="size-4 text-primary" aria-hidden="true" />
                    {formatTimeRange(item.startsAt, item.endsAt)}
                  </p>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </article>

        <div className="grid content-start gap-8">
          <article className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationLow backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="m-0 flex items-center gap-2 text-2xl font-black tracking-normal text-card-foreground">
                <MapPin className="size-6 text-primary" aria-hidden="true" />
                Places
              </h2>
              <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-primary/15 dark:text-primary">
                {pluralize(placeCount, 'saved place')}
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {trip.places.length === 0 ? (
                <p className="rounded-3xl border border-dashed border-border bg-muted/70 p-5 text-sm font-semibold text-muted-foreground">
                  No places have been shared yet.
                </p>
              ) : null}
              {trip.places.map((place) => (
                <article key={place.id} className="rounded-3xl border border-border/80 bg-background/70 p-5 shadow-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-xl font-black tracking-normal text-foreground">{place.name}</h3>
                    {place.category ? (
                      <span className="rounded-full bg-accent/45 px-3 py-1 text-xs font-black text-accent-foreground">
                        {place.category}
                      </span>
                    ) : null}
                  </div>
                  {place.address ? (
                    <p className="mt-2 text-sm font-semibold text-muted-foreground">{place.address}</p>
                  ) : null}
                  {place.notes ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{place.notes}</p> : null}
                  {place.url ? (
                    <Button asChild variant="quietOutline" size="pill" className="mt-4">
                      <a href={place.url} target="_blank" rel="noreferrer">
                        <ExternalLink />
                        Visit website
                      </a>
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationLow backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="m-0 flex items-center gap-2 text-2xl font-black tracking-normal text-card-foreground">
                <NotebookPen className="size-6 text-primary" aria-hidden="true" />
                Notes
              </h2>
              <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-primary/15 dark:text-primary">
                {pluralize(noteCount, 'shared note')}
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {trip.notes.length === 0 ? (
                <p className="rounded-3xl border border-dashed border-border bg-muted/70 p-5 text-sm font-semibold text-muted-foreground">
                  No notes have been shared yet.
                </p>
              ) : null}
              {trip.notes.map((note) => (
                <article key={note.id} className="rounded-3xl border border-border/80 bg-background/70 p-5 shadow-xs">
                  <h3 className="m-0 text-xl font-black tracking-normal text-foreground">{note.title}</h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{note.content}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default PublicTripPage;
