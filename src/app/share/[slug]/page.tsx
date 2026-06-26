import Link from 'next/link';
import { CalendarDays, MapPin, NotebookPen, Route } from 'lucide-react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { tripInclude } from '@/lib/tripServer';

const PublicTripPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: tripInclude,
  });

  if (!trip || trip.visibility !== 'PUBLIC') {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-viewportPadding py-10">
      <section className="rounded-lg border border-border bg-card p-8 shadow-elevationLow">
        <p className="text-xs font-extrabold tracking-[0.14em] text-secondary uppercase">Shared Trip Scribe</p>
        <h1 className="mt-2 text-4xl font-bold text-primary-950">{trip.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{trip.description}</p>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{trip.destinations.join(', ')}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-lg border border-border bg-card p-5 shadow-elevationLow">
          <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-primary-950">
            <Route className="size-5 text-primary" />
            Itinerary
          </h2>
          <div className="mt-4 grid gap-3">
            {trip.itineraryItems.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
                No itinerary items shared yet.
              </p>
            ) : null}
            {trip.itineraryItems.map((item) => (
              <div key={item.id} className="rounded-md border border-border bg-white p-3">
                <h3 className="m-0 text-base font-bold text-primary-950">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.startsAt ? new Date(item.startsAt).toLocaleString() : 'No date set'}
                </p>
                {item.description ? <p className="mt-2 text-sm">{item.description}</p> : null}
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border border-border bg-card p-5 shadow-elevationLow">
          <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-primary-950">
            <NotebookPen className="size-5 text-primary" />
            Notes
          </h2>
          <div className="mt-4 grid gap-3">
            {trip.notes.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
                No notes shared yet.
              </p>
            ) : null}
            {trip.notes.map((note) => (
              <div key={note.id} className="rounded-md border border-border bg-white p-3">
                <h3 className="m-0 text-base font-bold text-primary-950">{note.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border border-border bg-card p-5 shadow-elevationLow">
          <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-primary-950">
            <MapPin className="size-5 text-primary" />
            Places
          </h2>
          <div className="mt-4 grid gap-3">
            {trip.places.length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
                No places shared yet.
              </p>
            ) : null}
            {trip.places.map((place) => (
              <div key={place.id} className="rounded-md border border-border bg-white p-3">
                <h3 className="m-0 text-base font-bold text-primary-950">{place.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {[place.category, place.address].filter(Boolean).join(' - ')}
                </p>
                {place.url ? (
                  <Link href={place.url} className="mt-2 inline-flex text-sm text-primary">
                    Visit
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
};

export default PublicTripPage;
