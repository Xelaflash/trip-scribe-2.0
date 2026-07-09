import { DeleteTripAlertDialog } from '@/app/trips/components/DeleteTripAlertDialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getPlanningStatusOption } from '@/lib/tripPlanningStatus';
import type { TripWithDetails } from '@/queries/tripQueries';
import { CalendarDays, ExternalLink, Globe2, Lock } from 'lucide-react';
import Link from 'next/link';

interface TripHeaderProps {
  trip: TripWithDetails;
  isDeletingTrip: boolean;
  onDeleteTrip: (trip: Pick<TripWithDetails, 'slug' | 'title'>) => void;
}

export const TripHeader = ({ trip, isDeletingTrip, onDeleteTrip }: TripHeaderProps) => {
  const planningStatus = getPlanningStatusOption(trip.planningStatus);
  const StatusIcon = planningStatus.Icon;
  const dateRange = `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`;
  const visibilityLabel = trip.visibility === 'PUBLIC' ? 'Public trip' : 'Private planning trip';

  return (
    <section className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationMedium backdrop-blur-xl md:items-end md:p-8 lg:p-10">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
        {trip.description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{trip.description}</p>
        ) : null}
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:items-end mt-8">
        {trip.visibility === 'PUBLIC' && (
          <Button asChild variant="quietOutline" size="pill">
            <Link href={`/share/${trip.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Public page
            </Link>
          </Button>
        )}
        <DeleteTripAlertDialog
          trip={trip}
          isDeletingTrip={isDeletingTrip}
          onDeleteTrip={onDeleteTrip}
          triggerClassName="text-destructive-foreground"
          triggerLabel="Delete trip"
          triggerSize="pill"
          triggerVariant="destructive"
        />
      </div>
    </section>
  );
};
