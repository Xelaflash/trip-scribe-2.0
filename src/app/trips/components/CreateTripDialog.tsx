'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, Globe2, Lock, Plus, Route } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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

interface CreateTripDialogProps {
  triggerClassName?: string;
}

const dateInputClassName =
  'h-12 rounded-2xl border-border/80 bg-card/80 px-4 pl-11 font-semibold shadow-xs [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 dark:[color-scheme:dark]';

export const CreateTripDialog = ({ triggerClassName }: CreateTripDialogProps) => {
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
      toast.success('Trip created', {
        description: `${trip.title} is ready for notes, places, and plans.`,
      });
      setOpen(false);
      form.reset();
      router.push(`/trips/${trip.slug}`);
    },
    onError: (error) => {
      toast.error('Trip stayed on the runway', {
        description: 'Check the details and try creating it again.',
      });
      form.setError('title', {
        message: error instanceof Error && error.message ? error.message : 'Could not create trip.',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="pill" className={cn('w-full md:w-auto', triggerClassName)}>
          <Plus />
          New trip
        </Button>
      </DialogTrigger>
      <DialogContent className="grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="relative overflow-hidden border-b border-border/70 bg-surface/60 p-6 text-left md:px-8">
          <div className="absolute -top-12 -right-10 size-34 rounded-full bg-primary/12" aria-hidden="true" />
          <div className="absolute top-12 right-14 size-16 rounded-full bg-secondary/15" aria-hidden="true" />
          <div className="relative flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-3xl shadow-xs">
              🗺️
            </div>
            <div className="min-w-0">
              <div className="flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-black tracking-[0.16em] text-secondary uppercase">
                <Route className="size-3.5" aria-hidden="true" />
                New Travel Plan
              </div>
              <DialogTitle className="mt-3 text-3xl leading-tight font-black tracking-normal text-card-foreground">
                Create a trip
              </DialogTitle>
              <DialogDescription className="max-w-2xl text-base leading-6">
                Add the foundation now. Dates, destinations, itinerary items, places, and notes can keep evolving after
                the trip is created.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex min-h-0 flex-col"
            onSubmit={form.handleSubmit(async (values) => {
              form.clearErrors();
              try {
                await createMutation.mutateAsync(values);
              } catch {
                // createMutation.onError surfaces the failure in the form.
              }
            })}
          >
            <div className="grid gap-5 overflow-y-auto p-6 md:p-8">
              <div className="grid gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-card-foreground">Trip title</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
                          placeholder="Summer in Lisbon"
                          {...field}
                        />
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
                      <FormLabel className="font-black text-card-foreground">Destinations</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
                          placeholder="Lisbon, Porto, Sintra"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Separate multiple destinations with commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-card-foreground">Start date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays
                            className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-primary"
                            aria-hidden="true"
                          />
                          <Input className={dateInputClassName} type="date" {...field} />
                        </div>
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
                      <FormLabel className="font-black text-card-foreground">End date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDays
                            className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-primary"
                            aria-hidden="true"
                          />
                          <Input className={dateInputClassName} type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-card-foreground">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-28 rounded-2xl border-border/80 bg-card/80 px-4 py-3 font-medium shadow-xs"
                        placeholder="What kind of trip is this?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional. Add a quick planning note or trip theme.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-card-foreground">Visibility</FormLabel>
                    <FormControl>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label
                          className={cn(
                            'flex cursor-pointer gap-3 rounded-2xl border bg-card/80 p-4 shadow-xs transition-colors',
                            field.value === 'PRIVATE' ? 'border-primary ring-2 ring-primary/20' : 'border-border/80',
                          )}
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            value="PRIVATE"
                            checked={field.value === 'PRIVATE'}
                            onChange={() => field.onChange('PRIVATE')}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                          <Lock className="mt-0.5 size-5 text-primary" aria-hidden="true" />
                          <span>
                            <span className="block text-sm font-black text-card-foreground">Private</span>
                            <span className="mt-1 block text-sm text-muted-foreground">Only you can access it.</span>
                          </span>
                        </label>
                        <label
                          className={cn(
                            'flex cursor-pointer gap-3 rounded-2xl border bg-card/80 p-4 shadow-xs transition-colors',
                            field.value === 'PUBLIC' ? 'border-secondary ring-2 ring-secondary/20' : 'border-border/80',
                          )}
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            value="PUBLIC"
                            checked={field.value === 'PUBLIC'}
                            onChange={() => field.onChange('PUBLIC')}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                          <Globe2 className="mt-0.5 size-5 text-secondary" aria-hidden="true" />
                          <span>
                            <span className="block text-sm font-black text-card-foreground">Public</span>
                            <span className="mt-1 block text-sm text-muted-foreground">Create a shareable page.</span>
                          </span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="border-t border-border/70 bg-card/95 px-6 py-4 md:px-8">
              <Button
                type="submit"
                variant="gradient"
                size="pill"
                className="w-full sm:w-auto"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating trip...' : 'Create trip'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
