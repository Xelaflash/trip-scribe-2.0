'use client';

import { CalendarDays, MapPin, NotebookPen, Route } from 'lucide-react';
import { CreateTripDialog } from '@/app/trips/components/CreateTripDialog';
import { TripArticle } from '@/app/trips/components/TripArticle';
import { Input } from '@/components/ui/input';
import type { TripSummary } from '@/queries/tripQueries';

interface TripsListSectionProps {
  trips: TripSummary[];
  destinationCount: number;
  filter: string;
  isLoading: boolean;
  isDeletingTrip: boolean;
  onFilterChange: (nextFilter: string) => void;
  onDeleteTrip: (trip: Pick<TripSummary, 'slug' | 'title'>) => void;
}

export const TripsListSection = ({
  trips,
  destinationCount,
  filter,
  isLoading,
  isDeletingTrip,
  onFilterChange,
  onDeleteTrip,
}: TripsListSectionProps) => {
  const hasFilter = filter.trim().length > 0;

  return (
    <section className="rounded-3xl border border-border/80 bg-card/80 p-5 shadow-elevationLow backdrop-blur-xl md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="m-0 text-xl font-black tracking-normal text-card-foreground">Your trips</h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {destinationCount} saved {destinationCount === 1 ? 'destination' : 'destinations'}
          </p>
        </div>
        <Input
          aria-label="Filter trips"
          className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs md:max-w-xs"
          placeholder="Filter trips..."
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
        />
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading trips...</p> : null}
      {!isLoading && trips.length === 0 ? (
        <div className="overflow-hidden rounded-3xl border border-dashed border-border/90 bg-surface/60">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_18rem] md:items-center md:p-8">
            <div>
              <div className="flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-black tracking-[0.16em] text-secondary uppercase">
                <Route className="size-3.5" aria-hidden="true" />
                Fresh itinerary
              </div>
              <h3 className="mt-4 max-w-xl text-2xl leading-tight font-black tracking-normal text-card-foreground md:text-3xl">
                {hasFilter ? 'No trips match that search' : 'Start with the shape of your next trip'}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                {hasFilter
                  ? 'Try another destination, title, or clear the filter to see every trip in your workspace.'
                  : 'Create a workspace for dates, destinations, notes, places, and the itinerary you will keep refining as plans come together.'}
              </p>
              {!hasFilter ? <CreateTripDialog triggerClassName="mt-6 md:w-fit" /> : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-xs">
                <CalendarDays className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-black text-card-foreground">Dates</p>
                <p className="mt-1 text-sm text-muted-foreground">Anchor the plan.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-xs">
                <MapPin className="size-5 text-secondary" aria-hidden="true" />
                <p className="mt-3 text-sm font-black text-card-foreground">Places</p>
                <p className="mt-1 text-sm text-muted-foreground">Save stops.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-xs">
                <NotebookPen className="size-5 text-sky-500" aria-hidden="true" />
                <p className="mt-3 text-sm font-black text-card-foreground">Notes</p>
                <p className="mt-1 text-sm text-muted-foreground">Capture details.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {trips.map((trip) => (
          <TripArticle key={trip.id} trip={trip} isDeletingTrip={isDeletingTrip} onDeleteTrip={onDeleteTrip} />
        ))}
      </div>
    </section>
  );
};
