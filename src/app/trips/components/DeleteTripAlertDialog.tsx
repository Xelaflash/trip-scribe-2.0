'use client';

import { Trash2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { TripSummary } from '@/queries/tripQueries';

interface DeleteTripAlertDialogProps {
  trip: Pick<TripSummary, 'slug' | 'title'>;
  isDeletingTrip: boolean;
  onDeleteTrip: (trip: Pick<TripSummary, 'slug' | 'title'>) => void;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerSize?: ComponentProps<typeof Button>['size'];
  triggerVariant?: ComponentProps<typeof Button>['variant'];
}

export const DeleteTripAlertDialog = ({
  trip,
  isDeletingTrip,
  onDeleteTrip,
  triggerClassName = 'rounded-full bg-card/70',
  triggerLabel = 'Delete',
  triggerSize = 'sm',
  triggerVariant = 'quietOutline',
}: DeleteTripAlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
          disabled={isDeletingTrip}
          aria-label={`Delete ${trip.title}`}
        >
          <Trash2 aria-hidden="true" />
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden p-0">
        <div className="relative border-b border-border/70 bg-surface/60 p-6">
          <div className="absolute -top-10 -right-8 size-28 rounded-full bg-secondary/15" aria-hidden="true" />
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-secondary/15 text-3xl">
            🧳
          </div>
          <AlertDialogHeader className="relative mt-4">
            <AlertDialogTitle>Send this trip to lost luggage?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes <span className="font-black text-card-foreground">{trip.title}</span> and its
              itinerary, notes, and saved places. No tiny passport stamp can bring it back.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="p-6 pt-0">
          <AlertDialogCancel asChild>
            <Button variant="quietOutline" disabled={isDeletingTrip}>
              Keep trip
            </Button>
          </AlertDialogCancel>
          <Button
            variant="destructiveStable"
            onClick={() => onDeleteTrip({ slug: trip.slug, title: trip.title })}
            disabled={isDeletingTrip}
          >
            <Trash2 aria-hidden="true" />
            Delete forever
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
