'use client';

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
  onDeleteTrip: (slug: string) => void;
}

export const TripsListSection = ({
  trips,
  destinationCount,
  filter,
  isLoading,
  isDeletingTrip,
  onFilterChange,
  onDeleteTrip,
}: TripsListSectionProps) => (
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
      <p className="rounded-md border border-dashed border-border bg-muted p-6 text-center text-muted-foreground">
        No trips yet. Create your first trip to start planning.
      </p>
    ) : null}
    <div className="grid gap-4 lg:grid-cols-2">
      {trips.map((trip) => (
        <TripArticle key={trip.id} trip={trip} isDeletingTrip={isDeletingTrip} onDeleteTrip={onDeleteTrip} />
      ))}
    </div>
  </section>
);
