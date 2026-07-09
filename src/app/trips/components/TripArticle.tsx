'use client';

import { CalendarDays, ClipboardCheck, Globe2, Lock, MapPin, PencilLine, Sun } from 'lucide-react';
import Link from 'next/link';
import { DeleteTripAlertDialog } from '@/app/trips/components/DeleteTripAlertDialog';
import { getPlanningStatusOption } from '@/lib/tripPlanningStatus';
import type { TripSummary } from '@/queries/tripQueries';

const formatTripDate = (date: Date | string) => new Date(date).toLocaleDateString();

interface TripArticleProps {
  trip: TripSummary;
  isDeletingTrip: boolean;
  onDeleteTrip: (trip: Pick<TripSummary, 'slug' | 'title'>) => void;
}

export const TripArticle = ({ trip, isDeletingTrip, onDeleteTrip }: TripArticleProps) => {
  const planningStatus = getPlanningStatusOption(trip.planningStatus);
  const placeCount = trip._count.places ?? 0;

  return (
    <article className="group relative grid gap-5 overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-elevationLow transition hover:border-ring md:p-6">
      <Link
        href={`/trips/${trip.slug}`}
        aria-label={`Open ${trip.title}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      />
      <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,hsl(var(--ring)),hsl(160_64%_54%),hsl(19_100%_62%))]" />
      <div className="pointer-events-none relative z-20 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
            {trip.visibility === 'PUBLIC' ? <Globe2 className="size-3.5" /> : <Lock className="size-3.5" />}
            {trip.visibility.toLowerCase()}
          </span>
          <h3 className="m-0 mt-3 text-2xl leading-tight font-black tracking-normal text-foreground transition group-hover:text-primary">
            {trip.title}
          </h3>
        </div>
        <div className="pointer-events-auto relative z-30">
          <DeleteTripAlertDialog trip={trip} isDeletingTrip={isDeletingTrip} onDeleteTrip={onDeleteTrip} />
        </div>
      </div>
      <div className="pointer-events-none relative z-20 grid gap-2 text-sm font-medium text-muted-foreground">
        <p>{trip.destinations.join(' · ')}</p>
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4" />
          {formatTripDate(trip.startDate)} - {formatTripDate(trip.endDate)}
        </p>
      </div>
      <span className="pointer-events-none inline-flex w-fit items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-extrabold text-ink-700 dark:text-muted-foreground">
        <ClipboardCheck className="size-3.5" />
        {planningStatus.label}: {planningStatus.description}
      </span>

      <div className="pointer-events-none flex flex-wrap gap-3 text-xs font-extrabold text-ink-700 dark:text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Sun className="size-3.5" />
          {trip._count.itineraryItems} {trip._count.itineraryItems === 1 ? 'itinerary item' : 'itinerary items'}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {placeCount} saved {placeCount === 1 ? 'place' : 'places'}
        </span>
        <span className="inline-flex items-center gap-1">
          <PencilLine className="size-3.5" />
          {trip._count.notes} {trip._count.notes === 1 ? 'note' : 'notes'}
        </span>
      </div>
    </article>
  );
};
