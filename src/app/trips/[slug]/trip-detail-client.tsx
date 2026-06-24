'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ExternalLink, Globe2, Lock, MapPin, NotebookPen, Plus, Route, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  startsAt: z.string().min(1),
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

export function TripDetailClient({ trip }: { trip: TripWithDetails }) {
  const router = useRouter();

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
            <Button
              variant="outline"
              onClick={async () => {
                await deleteTrip(trip.slug);
                router.push('/trips');
              }}
            >
              <Trash2 />
              Delete trip
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="m-0 text-xl font-semibold">Overview</h2>
          <Form {...overviewForm}>
            <form
              className="mt-4 grid gap-4"
              onSubmit={overviewForm.handleSubmit(async (values) => {
                await updateTrip(trip.slug, {
                  ...values,
                  startDate: new Date(values.startDate),
                  endDate: new Date(values.endDate),
                  destinations: values.destinations
                    .split(',')
                    .map((destination) => destination.trim())
                    .filter(Boolean),
                });
                refresh();
              })}
            >
              <FormField
                control={overviewForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={overviewForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={overviewForm.control}
                name="destinations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinations</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={overviewForm.control}
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
                  control={overviewForm.control}
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
                  control={overviewForm.control}
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

        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
            <Route className="size-5 text-primary" />
            Itinerary
          </h2>
          <Form {...itineraryForm}>
            <form
              className="mt-4 grid gap-3"
              onSubmit={itineraryForm.handleSubmit(async (values) => {
                await createItineraryItem(trip.slug, {
                  ...values,
                  startsAt: new Date(values.startsAt),
                  endsAt: values.endsAt ? new Date(values.endsAt) : null,
                  sortOrder: trip.itineraryItems.length,
                });
                itineraryForm.reset();
                refresh();
              })}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <FormField
                  control={itineraryForm.control}
                  name="title"
                  render={({ field }) => <Input placeholder="Morning market walk" {...field} />}
                />
                <FormField
                  control={itineraryForm.control}
                  name="location"
                  render={({ field }) => <Input placeholder="Location" {...field} />}
                />
                <FormField
                  control={itineraryForm.control}
                  name="startsAt"
                  render={({ field }) => <Input type="datetime-local" {...field} />}
                />
                <FormField
                  control={itineraryForm.control}
                  name="endsAt"
                  render={({ field }) => <Input type="datetime-local" {...field} />}
                />
              </div>
              <FormField
                control={itineraryForm.control}
                name="description"
                render={({ field }) => <Textarea placeholder="Notes for this stop" {...field} />}
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
                      {new Date(item.startsAt).toLocaleString()}
                      {item.endsAt ? ` - ${new Date(item.endsAt).toLocaleString()}` : ''}
                    </p>
                    {item.location ? <p className="text-sm text-muted-foreground">{item.location}</p> : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      await deleteItineraryItem(trip.slug, item.id);
                      refresh();
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
            <NotebookPen className="size-5 text-primary" />
            Notes
          </h2>
          <Form {...noteForm}>
            <form
              className="mt-4 grid gap-3"
              onSubmit={noteForm.handleSubmit(async (values) => {
                await createNote(trip.slug, values);
                noteForm.reset();
                refresh();
              })}
            >
              <FormField
                control={noteForm.control}
                name="title"
                render={({ field }) => <Input placeholder="Packing reminders" {...field} />}
              />
              <FormField
                control={noteForm.control}
                name="content"
                render={({ field }) => <Textarea placeholder="Write a note..." {...field} />}
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
                      refresh();
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
            <MapPin className="size-5 text-primary" />
            Places
          </h2>
          <Form {...placeForm}>
            <form
              className="mt-4 grid gap-3"
              onSubmit={placeForm.handleSubmit(async (values) => {
                await createPlace(trip.slug, values);
                placeForm.reset();
                refresh();
              })}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <FormField
                  control={placeForm.control}
                  name="name"
                  render={({ field }) => <Input placeholder="Cafe name" {...field} />}
                />
                <FormField
                  control={placeForm.control}
                  name="category"
                  render={({ field }) => <Input placeholder="Cafe, landmark, hotel..." {...field} />}
                />
              </div>
              <FormField
                control={placeForm.control}
                name="address"
                render={({ field }) => <Input placeholder="Address" {...field} />}
              />
              <FormField
                control={placeForm.control}
                name="url"
                render={({ field }) => <Input placeholder="https://..." {...field} />}
              />
              <FormField
                control={placeForm.control}
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
                      refresh();
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
