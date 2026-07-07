'use client';

import { CalendarDays, Globe2, Lock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { TripSummary } from '@/queries/tripQueries';

const formatTripDate = (date: Date | string) => new Date(date).toLocaleDateString();

const getTripProgress = (trip: TripSummary) => {
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

interface TripArticleProps {
  trip: TripSummary;
  isDeletingTrip: boolean;
  onDeleteTrip: (slug: string) => void;
}

export const TripArticle = ({ trip, isDeletingTrip, onDeleteTrip }: TripArticleProps) => {
  const tripProgress = getTripProgress(trip);

  return (
    <article className="relative grid gap-5 overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-elevationLow transition hover:border-ring md:p-6">
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
          onClick={() => onDeleteTrip(trip.slug)}
          disabled={isDeletingTrip}
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
};
