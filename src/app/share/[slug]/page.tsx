import Link from 'next/link';
import { CalendarDays, MapPin, NotebookPen, Route } from 'lucide-react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { tripInclude } from '@/lib/tripServer';

export default async function PublicTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: tripInclude,
  });

  if (!trip || trip.visibility !== 'PUBLIC') {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <section className="rounded-lg border bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Shared Trip Scribe</p>
        <h1 className="mt-2 text-4xl font-semibold">{trip.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{trip.description}</p>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{trip.destinations.join(', ')}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
            <Route className="size-5 text-primary" />
            Itinerary
          </h2>
          <div className="mt-4 grid gap-3">
            {trip.itineraryItems.map((item) => (
              <div key={item.id} className="rounded-md bg-muted p-3">
                <h3 className="m-0 text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{new Date(item.startsAt).toLocaleString()}</p>
                {item.description ? <p className="mt-2 text-sm">{item.description}</p> : null}
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
            <NotebookPen className="size-5 text-primary" />
            Notes
          </h2>
          <div className="mt-4 grid gap-3">
            {trip.notes.map((note) => (
              <div key={note.id} className="rounded-md bg-muted p-3">
                <h3 className="m-0 text-base font-semibold">{note.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
            <MapPin className="size-5 text-primary" />
            Places
          </h2>
          <div className="mt-4 grid gap-3">
            {trip.places.map((place) => (
              <div key={place.id} className="rounded-md bg-muted p-3">
                <h3 className="m-0 text-base font-semibold">{place.name}</h3>
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
}
