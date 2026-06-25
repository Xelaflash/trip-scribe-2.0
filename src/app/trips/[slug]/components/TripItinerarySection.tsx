import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ItineraryForm } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createItineraryItem, deleteItineraryItem } from '@/queries/tripQueries';
import { Plus, Route, Trash2 } from 'lucide-react';

export const TripItinerarySection = ({
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
