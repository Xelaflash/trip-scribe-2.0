import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { PlaceForm } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createPlace, deletePlace } from '@/queries/tripQueries';
import { MapPin, Plus, Trash2 } from 'lucide-react';

export const TripPlacesSection = ({
  form,
  trip,
  onRefresh,
}: {
  form: PlaceForm;
  trip: TripWithDetails;
  onRefresh: () => void;
}) => {
  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-elevationLow">
      <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-primary-950">
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
        {trip.places.length === 0 ? (
          <p className="rounded-md border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
            No saved places yet.
          </p>
        ) : null}
        {trip.places.map((place) => (
          <div key={place.id} className="rounded-md border border-border bg-white p-3">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="m-0 text-base font-bold text-primary-950">{place.name}</h3>
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
