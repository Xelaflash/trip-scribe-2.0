import { Button } from '@/components/ui/button';
import type { TripWithDetails } from '@/queries/tripQueries';
import { ExternalLink, Globe2, Lock, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const TripHeader = ({ trip, onDelete }: { trip: TripWithDetails; onDelete: () => Promise<void> }) => {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-elevationLow">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            {trip.visibility === 'PUBLIC' ? <Globe2 className="size-4" /> : <Lock className="size-4" />}
            {trip.visibility === 'PUBLIC' ? 'Public share page enabled' : 'Private planning trip'}
          </div>
          <h1 className="mt-2 text-3xl font-bold text-primary-950">{trip.title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {trip.description || 'Add a description to frame this trip.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {trip.visibility === 'PUBLIC' ? (
            <Button asChild variant="outline">
              <Link href={`/share/${trip.slug}`}>
                <ExternalLink />
                Public page
              </Link>
            </Button>
          ) : null}
          <Button variant="outline" onClick={onDelete}>
            <Trash2 />
            Delete trip
          </Button>
        </div>
      </div>
    </section>
  );
};
