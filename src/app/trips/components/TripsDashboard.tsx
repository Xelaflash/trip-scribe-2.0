'use client';

import type { Trip } from '@prisma/generated';
import { CalendarDays, Globe2, Lock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CreateTripDialog } from '@/app/trips/components/CreateTripDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deleteTrip, getTrips } from '@/queries/tripQueries';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const formatTripDate = (date: Date | string) => new Date(date).toLocaleDateString();

const getTripProgress = (trip: Trip) => {
  const completedSections = [
    trip.title,
    trip.description,
    trip.destinations.length > 0,
    trip.startDate,
    trip.endDate,
    trip.visibility,
  ].filter(Boolean).length;

  return Math.max(20, Math.round((completedSections / 6) * 100));
};

/** Renders the authenticated trip dashboard and handles create/delete trip mutations. */
export const TripsDashboard = ({ userName }: { userName: string }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const { data: trips = [], isLoading } = useQuery({ queryKey: ['trips'], queryFn: getTrips });

  const deleteMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });

  const filteredTrips = trips.filter((trip) => {
    const haystack = `${trip.title} ${trip.destinations.join(' ')}`.toLowerCase();
    return haystack.includes(filter.toLowerCase());
  });
  const publicTripCount = trips.filter((trip) => trip.visibility === 'PUBLIC').length;
  const privateTripCount = trips.length - publicTripCount;
  const destinationCount = new Set(trips.flatMap((trip) => trip.destinations)).size;

  return (
    <main className="mx-auto flex w-full max-w-295 flex-col gap-8 px-viewportPadding py-10 lg:py-12">
      <section className="grid gap-6 rounded-4xl border border-border/80 bg-card/80 p-6 shadow-elevationLow backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-end md:p-8">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-secondary uppercase">Trip workspace</p>
          <h1 className="mt-3 text-4xl leading-tight font-black tracking-normal text-card-foreground md:text-5xl">
            {userName}&apos;s trips
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Plan upcoming travel, keep your itinerary organized, and publish a read-only trip page when it is ready to
            share.
          </p>
          <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <b className="block text-3xl leading-none font-black tracking-normal text-card-foreground">
                {trips.length}
              </b>
              <span className="mt-1 block text-sm font-bold text-muted-foreground">active trips</span>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <b className="block text-3xl leading-none font-black tracking-normal text-card-foreground">
                {publicTripCount}
              </b>
              <span className="mt-1 block text-sm font-bold text-muted-foreground">public pages</span>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <b className="block text-3xl leading-none font-black tracking-normal text-card-foreground">
                {privateTripCount}
              </b>
              <span className="mt-1 block text-sm font-bold text-muted-foreground">private drafts</span>
            </div>
          </div>
        </div>
        <CreateTripDialog />
      </section>

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
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
        {isLoading ? <p className="text-muted-foreground">Loading trips...</p> : null}
        {!isLoading && filteredTrips.length === 0 ? (
          <p className="rounded-md border border-dashed border-border bg-muted p-6 text-center text-muted-foreground">
            No trips yet. Create your first trip to start planning.
          </p>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTrips.map((trip) => {
            const tripProgress = getTripProgress(trip);

            return (
              <article
                key={trip.id}
                className="relative grid gap-5 overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-elevationLow transition hover:border-ring md:p-6"
              >
                <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,hsl(var(--ring)),hsl(160_64%_54%),hsl(19_100%_62%))]" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
                      {trip.visibility === 'PUBLIC' ? <Globe2 className="size-3.5" /> : <Lock className="size-3.5" />}
                      {trip.visibility.toLowerCase()}
                    </span>
                    <Link href={`/trips/${trip.slug}`} className="mt-3 block min-w-0 no-underline">
                      <h3 className="m-0 text-2xl leading-tight font-black tracking-normal text-foreground transition hover:text-primary">
                        {trip.title}
                      </h3>
                    </Link>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-card/70"
                    onClick={() => deleteMutation.mutate(trip.slug)}
                    disabled={deleteMutation.isPending}
                    aria-label={`Delete ${trip.title}`}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
                <div className="grid gap-2 text-sm font-medium text-muted-foreground">
                  <p>{trip.destinations.join(' · ')}</p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {formatTripDate(trip.startDate)} - {formatTripDate(trip.endDate)}
                  </p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-ink-950/10 dark:bg-white/10">
                  <span
                    className="block h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--ring)),hsl(160_64%_54%))]"
                    style={{ width: `${tripProgress}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-extrabold text-ink-700 dark:text-muted-foreground">
                  <span>Plan {tripProgress}% complete</span>
                  <span>
                    {trip.destinations.length} {trip.destinations.length === 1 ? 'destination' : 'destinations'}
                  </span>
                  <Link href={`/trips/${trip.slug}`} className="text-primary no-underline hover:underline">
                    Open trip
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};
