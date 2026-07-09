import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPlanningStatusOption } from '@/lib/tripPlanningStatus';
import type { TripWithDetails } from '@/queries/tripQueries';
import { CalendarDays, ExternalLink, Globe2, Lock, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const TripHeader = ({ trip, onDelete }: { trip: TripWithDetails; onDelete: () => Promise<void> }) => {
  const planningStatus = getPlanningStatusOption(trip.planningStatus);
  const StatusIcon = planningStatus.Icon;
  const dateRange = `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`;
  const visibilityLabel = trip.visibility === 'PUBLIC' ? 'Public trip' : 'Private planning trip';

  return (
    <section className="grid gap-6 rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationMedium backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-end md:p-8 lg:p-10">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] text-secondary uppercase">
            {trip.visibility === 'PUBLIC' ? (
              <Globe2 className="size-4" aria-hidden="true" />
            ) : (
              <Lock className="size-4" aria-hidden="true" />
            )}
            {visibilityLabel}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black shadow-xs',
              planningStatus.badgeClassName,
            )}
          >
            <StatusIcon className="size-4" aria-hidden="true" />
            {planningStatus.label}
          </span>
        </div>
        <h1 className="mt-4 text-4xl leading-none font-black tracking-normal text-card-foreground md:text-6xl">
          {trip.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-base font-semibold text-muted-foreground md:text-lg">
          <span>{trip.destinations.join(', ')}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
            {dateRange}
          </span>
          <span aria-hidden="true">·</span>
          <span>{planningStatus.description}</span>
        </div>
        {trip.description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{trip.description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 md:items-end">
        <div className="flex w-fit gap-1 rounded-full bg-muted/80 p-1.5 shadow-inner">
          <span className="rounded-full bg-card px-5 py-2 text-sm font-black text-primary shadow-xs">Plan</span>
          <span className="px-5 py-2 text-sm font-black text-muted-foreground">Preview</span>
          <span className="px-5 py-2 text-sm font-black text-muted-foreground">Public</span>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {trip.visibility === 'PUBLIC' ? (
            <Button asChild variant="quietOutline" size="pill">
              <Link href={`/share/${trip.slug}`}>
                <ExternalLink />
                Public page
              </Link>
            </Button>
          ) : null}
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={onDelete}>
            <Trash2 />
            Delete trip
          </Button>
        </div>
      </div>
    </section>
  );
};
