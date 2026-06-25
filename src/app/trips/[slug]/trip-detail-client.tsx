'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ExternalLink, Globe2, Lock, MapPin, NotebookPen, Plus, Route, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { tripPlaceholderSets, type TripPlaceholderSet } from '@/app/trips/data/placeholders';
import {
  createItineraryItem,
  createNote,
  createPlace,
  deleteItineraryItem,
  deleteNote,
  deletePlace,
  deleteTrip,
  type TripWithDetails,
  updateTrip,
} from '@/queries/tripQueries';

const overviewSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  destinations: z.string().min(2),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

const itinerarySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

const noteSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
});

const placeSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  address: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional(),
});

function dateInputValue(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

type OverviewForm = UseFormReturn<z.infer<typeof overviewSchema>>;
type ItineraryForm = UseFormReturn<z.infer<typeof itinerarySchema>>;
type NoteForm = UseFormReturn<z.infer<typeof noteSchema>>;
type PlaceForm = UseFormReturn<z.infer<typeof placeSchema>>;

function nextPlaceholderIndex(index: number) {
  return (index + 1) % tripPlaceholderSets.length;
}

export const TripDetailClient = ({ trip }: { trip: TripWithDetails }) => {
  const router = useRouter();
  const [overviewPlaceholderIndex, setOverviewPlaceholderIndex] = useState(0);
  const [itineraryPlaceholderIndex, setItineraryPlaceholderIndex] = useState(1);
  const [notePlaceholderIndex, setNotePlaceholderIndex] = useState(2);

  const overviewForm = useForm<z.infer<typeof overviewSchema>>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {
      title: trip.title,
      description: trip.description ?? '',
      destinations: trip.destinations.join(', '),
      visibility: trip.visibility,
      startDate: dateInputValue(trip.startDate),
      endDate: dateInputValue(trip.endDate),
    },
  });
  const itineraryForm = useForm<z.infer<typeof itinerarySchema>>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: { title: '', description: '', location: '', startsAt: '', endsAt: '' },
  });
  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', content: '' },
  });
  const placeForm = useForm<z.infer<typeof placeSchema>>({
    resolver: zodResolver(placeSchema),
    defaultValues: { name: '', category: '', address: '', url: '', notes: '' },
  });

  async function refresh() {
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <Link
        href="/trips"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary no-underline"
      >
        <ArrowLeft className="size-4" />
        Back to trips
      </Link>

      <TripHeader trip={trip} onDelete={() => deleteTrip(trip.slug).then(() => router.push('/trips'))} />

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <OverviewSection
          form={overviewForm}
          placeholders={tripPlaceholderSets[overviewPlaceholderIndex]}
          trip={trip}
          onPlaceholderChange={() => setOverviewPlaceholderIndex(nextPlaceholderIndex)}
          onRefresh={refresh}
        />
        <ItinerarySection
          form={itineraryForm}
          placeholders={tripPlaceholderSets[itineraryPlaceholderIndex]}
          trip={trip}
          onPlaceholderChange={() => setItineraryPlaceholderIndex(nextPlaceholderIndex)}
          onRefresh={refresh}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <NotesSection
          form={noteForm}
          placeholders={tripPlaceholderSets[notePlaceholderIndex]}
          trip={trip}
          onPlaceholderChange={() => setNotePlaceholderIndex(nextPlaceholderIndex)}
          onRefresh={refresh}
        />
        <PlacesSection form={placeForm} trip={trip} onRefresh={refresh} />
      </section>
    </main>
  );
};

const TripHeader = ({ trip, onDelete }: { trip: TripWithDetails; onDelete: () => Promise<void> }) => {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {trip.visibility === 'PUBLIC' ? <Globe2 className="size-4" /> : <Lock className="size-4" />}
            {trip.visibility === 'PUBLIC' ? 'Public share page enabled' : 'Private planning trip'}
          </div>
          <h1 className="mt-2 text-3xl font-semibold">{trip.title}</h1>
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

const OverviewSection = ({
  form,
  placeholders,
  trip,
  onPlaceholderChange,
  onRefresh,
}: {
  form: OverviewForm;
  placeholders: TripPlaceholderSet;
  trip: TripWithDetails;
  onPlaceholderChange: () => void;
  onRefresh: () => void;
}) => {
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="m-0 text-xl font-semibold">Overview</h2>
      <Form {...form}>
        <form
          className="mt-4 grid gap-4"
          onSubmit={form.handleSubmit(async (values) => {
            await updateTrip(trip.slug, {
              ...values,
              startDate: new Date(values.startDate),
              endDate: new Date(values.endDate),
              destinations: values.destinations.split(',').flatMap((destination) => {
                const trimmedDestination = destination.trim();
                return trimmedDestination ? [trimmedDestination] : [];
              }),
            });
            onPlaceholderChange();
            onRefresh();
          })}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder={placeholders.tripTitle} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder={placeholders.tripDescription} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destinations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinations</FormLabel>
                <FormControl>
                  <Input placeholder={placeholders.tripDestinations} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" {...field}>
                      <option value="PRIVATE">Private</option>
                      <option value="PUBLIC">Public</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Save overview</Button>
        </form>
      </Form>
    </article>
  );
};

const ItinerarySection = ({
  form,
  placeholders,
  trip,
  onPlaceholderChange,
  onRefresh,
}: {
  form: ItineraryForm;
  placeholders: TripPlaceholderSet;
  trip: TripWithDetails;
  onPlaceholderChange: () => void;
  onRefresh: () => void;
}) => {
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
        <Route className="size-5 text-primary" />
        Itinerary
      </h2>
      <Form {...form}>
        <form
          className="mt-4 grid gap-3"
          onSubmit={form.handleSubmit(async (values) => {
            await createItineraryItem(trip.slug, {
              ...values,
              startsAt: values.startsAt ? new Date(values.startsAt) : null,
              endsAt: values.endsAt ? new Date(values.endsAt) : null,
              sortOrder: trip.itineraryItems.length,
            });
            form.reset();
            onPlaceholderChange();
            onRefresh();
          })}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => <Input placeholder={placeholders.itineraryTitle} {...field} />}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => <Input placeholder={placeholders.itineraryLocation} {...field} />}
            />
            <FormField
              control={form.control}
              name="startsAt"
              render={({ field }) => <Input type="datetime-local" {...field} />}
            />
            <FormField
              control={form.control}
              name="endsAt"
              render={({ field }) => <Input type="datetime-local" {...field} />}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => <Textarea placeholder={placeholders.itineraryDescription} {...field} />}
          />
          <Button type="submit" size="sm">
            <Plus />
            Add itinerary item
          </Button>
        </form>
      </Form>
      <div className="mt-5 grid gap-3">
        {trip.itineraryItems.map((item) => (
          <div key={item.id} className="rounded-md border p-3">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="m-0 text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.startsAt ? new Date(item.startsAt).toLocaleString() : 'No date set'}
                  {item.endsAt ? ` - ${new Date(item.endsAt).toLocaleString()}` : ''}
                </p>
                {item.location ? <p className="text-sm text-muted-foreground">{item.location}</p> : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await deleteItineraryItem(trip.slug, item.id);
                  onRefresh();
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

const NotesSection = ({
  form,
  placeholders,
  trip,
  onPlaceholderChange,
  onRefresh,
}: {
  form: NoteForm;
  placeholders: TripPlaceholderSet;
  trip: TripWithDetails;
  onPlaceholderChange: () => void;
  onRefresh: () => void;
}) => {
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
        <NotebookPen className="size-5 text-primary" />
        Notes
      </h2>
      <Form {...form}>
        <form
          className="mt-4 grid gap-3"
          onSubmit={form.handleSubmit(async (values) => {
            await createNote(trip.slug, values);
            form.reset();
            onPlaceholderChange();
            onRefresh();
          })}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => <Input placeholder={placeholders.noteTitle} {...field} />}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => <Textarea placeholder={placeholders.noteContent} {...field} />}
          />
          <Button type="submit" size="sm">
            <Plus />
            Add note
          </Button>
        </form>
      </Form>
      <div className="mt-5 grid gap-3">
        {trip.notes.map((note) => (
          <div key={note.id} className="rounded-md border p-3">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="m-0 text-base font-semibold">{note.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await deleteNote(trip.slug, note.id);
                  onRefresh();
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

const PlacesSection = ({
  form,
  trip,
  onRefresh,
}: {
  form: PlaceForm;
  trip: TripWithDetails;
  onRefresh: () => void;
}) => {
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
        <MapPin className="size-5 text-primary" />
        Places
      </h2>
      <Form {...form}>
        <form
          className="mt-4 grid gap-3"
          onSubmit={form.handleSubmit(async (values) => {
            await createPlace(trip.slug, values);
            form.reset();
            onRefresh();
          })}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => <Input placeholder="Cafe name" {...field} />}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => <Input placeholder="Cafe, landmark, hotel..." {...field} />}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => <Input placeholder="Address" {...field} />}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => <Input placeholder="https://..." {...field} />}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => <Textarea placeholder="Why save this place?" {...field} />}
          />
          <Button type="submit" size="sm">
            <Plus />
            Add place
          </Button>
        </form>
      </Form>
      <div className="mt-5 grid gap-3">
        {trip.places.map((place) => (
          <div key={place.id} className="rounded-md border p-3">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="m-0 text-base font-semibold">{place.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {[place.category, place.address].filter(Boolean).join(' - ')}
                </p>
                {place.url ? (
                  <a href={place.url} target="_blank" rel="noreferrer" className="text-sm text-primary">
                    Open link
                  </a>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await deletePlace(trip.slug, place.id);
                  onRefresh();
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};
