import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { OverviewForm } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import type { TripWithDetails } from '@/queries/tripQueries';
import { updateTrip } from '@/queries/tripQueries';

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
