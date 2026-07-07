'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { TripsListSection } from '@/app/trips/components/TripsListSection';
import { TripsWorkspaceSection } from '@/app/trips/components/TripsWorkspaceSection';
import { deleteTrip, getTrips } from '@/queries/tripQueries';
import type { TripSummary } from '@/queries/tripQueries';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** Renders the authenticated trip dashboard and handles create/delete trip mutations. */
export const TripsDashboard = ({ userName }: { userName: string }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const { data: trips = [], isLoading } = useQuery({ queryKey: ['trips'], queryFn: getTrips });

  const deleteMutation = useMutation({
    mutationFn: (trip: Pick<TripSummary, 'slug' | 'title'>) => deleteTrip(trip.slug),
    onSuccess: async (_data, trip) => {
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deleted', {
        description: `${trip.title} has left the itinerary board.`,
      });
    },
    onError: () => {
      toast.error('Could not delete trip', {
        description: 'The trip dodged the delete button. Try again in a moment.',
      });
    },
  });

  const filteredTrips = trips.filter((trip) => {
    const haystack = `${trip.title} ${trip.destinations.join(' ')}`.toLowerCase();
    return haystack.includes(filter.toLowerCase());
  });
  const activeTripCount = trips.length;
  const itineraryItemCount = trips.reduce((count, trip) => count + trip._count.itineraryItems, 0);
  const noteCount = trips.reduce((count, trip) => count + trip._count.notes, 0);
  const destinationCount = new Set(trips.flatMap((trip) => trip.destinations)).size;

  return (
    <main className="mx-auto flex w-full max-w-295 flex-col gap-8 px-viewportPadding py-10 lg:py-12">
      <TripsWorkspaceSection
        userName={userName}
        activeTripCount={activeTripCount}
        itineraryItemCount={itineraryItemCount}
        noteCount={noteCount}
      />
      <TripsListSection
        trips={filteredTrips}
        destinationCount={destinationCount}
        filter={filter}
        isLoading={isLoading}
        isDeletingTrip={deleteMutation.isPending}
        onFilterChange={setFilter}
        onDeleteTrip={deleteMutation.mutate}
      />
    </main>
  );
};
