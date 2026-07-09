import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { OverviewForm } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import { getPlanningStatusOption, planningStatusOptions } from '@/lib/tripPlanningStatus';
import { cn } from '@/lib/utils';
import type { TripWithDetails } from '@/queries/tripQueries';
import { updateTrip } from '@/queries/tripQueries';
import { Globe2, Lock, Save } from 'lucide-react';

export const TripOverviewSection = ({
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
  const isSubmitting = form.formState.isSubmitting;

  return (
    <article className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationLow backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="m-0 text-2xl font-black tracking-normal text-card-foreground">Overview</h2>
        <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-primary/15 dark:text-primary">
          Trip basics
        </span>
      </div>
      <Form {...form}>
        <form
          className="mt-5 grid gap-4"
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
                  <Input
                    className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-black shadow-xs"
                    placeholder={placeholders.tripTitle}
                    {...field}
                  />
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
                  <Textarea
                    className="min-h-28 rounded-2xl border-border/80 bg-card/80 px-4 py-3 font-medium shadow-xs"
                    placeholder={placeholders.tripDescription}
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
                <FormLabel>Destinations</FormLabel>
                <FormControl>
                  <Input
                    className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
                    placeholder={placeholders.tripDestinations}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start</FormLabel>
                  <FormControl>
                    <DatePicker placeholder="Start date" {...field} />
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
                    <DatePicker placeholder="End date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
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
          <FormField
            control={form.control}
            name="planningStatus"
            render={({ field }) => {
              const selectedStatus = getPlanningStatusOption(field.value);
              const SelectedStatusIcon = selectedStatus.Icon;

              return (
                <FormItem>
                  <FormLabel>Plan status</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <SelectedStatusIcon
                        className={cn(
                          'pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2',
                          selectedStatus.iconClassName,
                        )}
                        aria-hidden="true"
                      />
                      <select
                        className="h-12 w-full appearance-none rounded-2xl border border-input bg-card/80 px-12 text-sm font-black text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        {...field}
                      >
                        {planningStatusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}: {status.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" variant="gradient" size="pill" className="w-full" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? 'Saving overview...' : 'Save overview'}
          </Button>
        </form>
      </Form>
    </article>
  );
};
