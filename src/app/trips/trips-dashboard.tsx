'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, Globe2, Lock, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createTrip, deleteTrip, getTrips } from '@/queries/tripQueries';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const tripFormSchema = z.object({
  title: z.string().min(2, 'Add a trip title.'),
  description: z.string().optional(),
  destinations: z.string().min(2, 'Add at least one destination.'),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  startDate: z.string().min(1, 'Choose a start date.'),
  endDate: z.string().min(1, 'Choose an end date.'),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

export function TripsDashboard({ userName }: { userName: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const { data: trips = [], isLoading } = useQuery({ queryKey: ['trips'], queryFn: getTrips });

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: '',
      description: '',
      destinations: '',
      visibility: 'PRIVATE',
      startDate: '',
      endDate: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: TripFormValues) =>
      createTrip({
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        destinations: values.destinations.split(',').flatMap((destination) => {
          const trimmedDestination = destination.trim();
          return trimmedDestination ? [trimmedDestination] : [];
        }),
      }),
    onSuccess: async (trip) => {
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      setOpen(false);
      form.reset();
      router.push(`/trips/${trip.slug}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });

  const filteredTrips = trips.filter((trip) => {
    const haystack = `${trip.title} ${trip.destinations.join(' ')}`.toLowerCase();
    return haystack.includes(filter.toLowerCase());
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Trip workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">{userName}&apos;s trips</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Plan upcoming travel, keep your itinerary organized, and publish a read-only trip page when it is ready to
            share.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus />
              New trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create a trip</DialogTitle>
              <DialogDescription>
                Add the basics now. You can add itinerary items, notes, and places next.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="grid gap-4" onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer in Lisbon" {...field} />
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
                        <Textarea placeholder="What kind of trip is this?" {...field} />
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
                        <Input placeholder="Lisbon, Porto, Sintra" {...field} />
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
                        <FormLabel>Start date</FormLabel>
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
                        <FormLabel>End date</FormLabel>
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
                <Button type="submit" disabled={createMutation.isPending}>
                  Create trip
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="m-0 text-xl font-semibold">Your trips</h2>
          <Input
            className="md:max-w-xs"
            placeholder="Filter trips..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
        {isLoading ? <p className="text-muted-foreground">Loading trips...</p> : null}
        {!isLoading && filteredTrips.length === 0 ? (
          <p className="rounded-md bg-muted p-6 text-center text-muted-foreground">
            No trips yet. Create your first trip to start planning.
          </p>
        ) : null}
        <div className="grid gap-3">
          {filteredTrips.map((trip) => (
            <article
              key={trip.id}
              className="flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center md:justify-between"
            >
              <Link href={`/trips/${trip.slug}`} className="min-w-0 flex-1 no-underline">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {trip.visibility === 'PUBLIC' ? <Globe2 className="size-4" /> : <Lock className="size-4" />}
                  {trip.visibility.toLowerCase()}
                </div>
                <h3 className="m-0 mt-1 text-xl font-semibold">{trip.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{trip.destinations.join(', ')}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteMutation.mutate(trip.slug)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 />
                Delete
              </Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
