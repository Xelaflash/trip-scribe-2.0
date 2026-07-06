'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
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
import { createTrip } from '@/queries/tripQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const tripFormSchema = z.object({
  title: z.string().min(2, 'Add a trip title.'),
  description: z.string().optional(),
  destinations: z.string().min(2, 'Add at least one destination.'),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  startDate: z.string().min(1, 'Choose a start date.'),
  endDate: z.string().min(1, 'Choose an end date.'),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

export const CreateTripDialog = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

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
    onError: (error) => {
      form.setError('title', {
        message: error instanceof Error && error.message ? error.message : 'Could not create trip.',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="pill" className="w-full md:w-auto">
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
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(async (values) => {
              form.clearErrors();
              try {
                await createMutation.mutateAsync(values);
              } catch {
                // createMutation.onError surfaces the failure in the form.
              }
            })}
          >
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
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                        {...field}
                      >
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
              {createMutation.isPending ? 'Creating trip...' : 'Create trip'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
