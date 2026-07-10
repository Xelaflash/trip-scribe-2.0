'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, ExternalLink, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DeleteTripDetailItemAlertDialog } from '@/app/trips/[slug]/components/DeleteTripDetailItemAlertDialog';
import { PlaceSearchField, type SelectedPlaceSearchResult } from '@/app/trips/[slug]/components/PlaceSearchField';
import { TripDialogHeader } from '@/app/trips/[slug]/components/TripDialogHeader';
import { TripPlacesMap } from '@/app/trips/[slug]/components/TripPlacesMap';
import { placeSchema, type PlaceForm, type PlaceFormValues } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { PlaceCreateInput, PlaceUpdateInput } from '@/lib/tripValidation';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createPlace, deletePlace, updatePlace } from '@/queries/tripQueries';

const placePayload = (values: PlaceFormValues): PlaceCreateInput | PlaceUpdateInput => ({
  name: values.name,
  category: values.category,
  address: values.address,
  mapboxId: values.mapboxId,
  featureType: values.featureType,
  latitude: values.latitude,
  longitude: values.longitude,
  url: values.url,
  notes: values.notes,
});

const clearPlaceSelection = (form: PlaceForm) => {
  form.setValue('mapboxId', '', { shouldDirty: true });
  form.setValue('featureType', '', { shouldDirty: true });
  form.setValue('latitude', null, { shouldDirty: true });
  form.setValue('longitude', null, { shouldDirty: true });
};

const applySelectedPlace = (form: PlaceForm, place: SelectedPlaceSearchResult) => {
  form.setValue('address', place.address, { shouldDirty: true, shouldValidate: true });
  form.setValue('mapboxId', place.mapboxId ?? '', { shouldDirty: true });
  form.setValue('featureType', place.featureType ?? '', { shouldDirty: true });
  form.setValue('latitude', place.latitude, { shouldDirty: true });
  form.setValue('longitude', place.longitude, { shouldDirty: true });

  if (place.name && !(form.getValues('name') ?? '').trim()) {
    form.setValue('name', place.name, { shouldDirty: true, shouldValidate: true });
  }

  if (place.category && !(form.getValues('category') ?? '').trim()) {
    form.setValue('category', place.category, { shouldDirty: true, shouldValidate: true });
  }
};

const PlaceFormFields = ({ form }: { form: PlaceForm }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-black shadow-xs"
                  placeholder="Cafe name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
                  placeholder="Cafe, landmark, hotel..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <PlaceSearchField
                mode="place"
                value={field.value ?? ''}
                placeholder="Full address or place address"
                onBlur={field.onBlur}
                onManualChange={(nextAddress) => {
                  field.onChange(nextAddress);
                  clearPlaceSelection(form);
                }}
                onSelect={(place) => applySelectedPlace(form, place)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link</FormLabel>
            <FormControl>
              <Input
                className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
                placeholder="https://..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <p className="rounded-2xl border border-border/70 bg-muted/50 px-4 py-3 text-sm font-semibold text-muted-foreground">
        Search for an address, hotel, cafe, landmark, or place. Pins are saved from the selected result coordinates.
      </p>
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                className="min-h-28 rounded-2xl border-border/80 bg-card/80 px-4 py-3 font-medium shadow-xs"
                placeholder="Why save this place?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const TripPlacesSection = ({
  form,
  trip,
  onRefresh,
}: {
  form: PlaceForm;
  trip: TripWithDetails;
  onRefresh: () => void;
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const editForm = useForm<PlaceFormValues>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: '',
      category: '',
      address: '',
      mapboxId: '',
      featureType: '',
      latitude: null,
      longitude: null,
      url: '',
      notes: '',
    },
  });

  const editingPlace = trip.places.find((place) => place.id === editingPlaceId);
  const isCreating = form.formState.isSubmitting;
  const isUpdating = editForm.formState.isSubmitting;

  const openEditDialog = (place: TripWithDetails['places'][number]) => {
    editForm.reset({
      name: place.name,
      category: place.category ?? '',
      address: place.address ?? '',
      mapboxId: place.mapboxId ?? '',
      featureType: place.featureType ?? '',
      latitude: place.latitude,
      longitude: place.longitude,
      url: place.url ?? '',
      notes: place.notes ?? '',
    });
    setEditingPlaceId(place.id);
  };

  const handleCreatePlaceSubmit = form.handleSubmit(async (values) => {
    try {
      await createPlace(trip.slug, placePayload(values) as PlaceCreateInput);
      toast.success('Place added', {
        description: `${values.name} was saved to this trip.`,
      });
      form.reset();
      setIsCreateDialogOpen(false);
      onRefresh();
    } catch {
      toast.error('Could not add place', {
        description: 'Check the details and try adding it again.',
      });
    }
  });

  const handleEditPlaceSubmit = editForm.handleSubmit(async (values) => {
    if (!editingPlace) {
      return;
    }

    try {
      await updatePlace(trip.slug, editingPlace.id, placePayload(values) as PlaceUpdateInput);
      toast.success('Place updated', {
        description: `${values.name} was saved.`,
      });
      setEditingPlaceId(null);
      onRefresh();
    } catch {
      toast.error('Could not update place', {
        description: 'Your changes were not saved. Try again in a moment.',
      });
    }
  });

  return (
    <article className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationLow backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 flex items-center gap-2 text-2xl font-black tracking-normal text-card-foreground">
          <MapPin className="size-6 text-primary" />
          Places
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="pill">
              <Plus />
              Add place
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
            <TripDialogHeader
              backgroundImageSrc="/pics/pexels-karlsolano-7282788.jpg"
              description="Search for a place or address and save its coordinates for the trip map."
              emoji="📍"
              eyebrow="Places"
              title="Add place"
            />
            <Form {...form}>
              <form onSubmit={handleCreatePlaceSubmit}>
                <div className="max-h-[calc(100svh-16rem)] overflow-y-auto p-6">
                  <PlaceFormFields form={form} />
                </div>
                <DialogFooter className="border-t border-border/70 bg-card/95 px-6 py-4">
                  <Button type="submit" variant="gradient" size="pill" disabled={isCreating}>
                    {isCreating ? 'Finding pin...' : 'Add place'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <TripPlacesMap places={trip.places} className="mt-6 min-h-72" />

      <div className="mt-6 grid gap-4">
        {trip.places.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-muted/70 p-5 text-sm font-semibold text-muted-foreground">
            No saved places yet.
          </p>
        ) : null}
        {trip.places.map((place) => {
          const hasPin = typeof place.latitude === 'number' && typeof place.longitude === 'number';

          return (
            <article key={place.id} className="rounded-3xl border border-border/80 bg-background/70 p-5 shadow-xs">
              <div className="flex justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-xl font-black tracking-normal text-foreground">{place.name}</h3>
                    <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-primary/15 dark:text-primary">
                      {hasPin ? 'Pinned' : 'No pin yet'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-muted-foreground">
                    {[place.category, place.address].filter(Boolean).join(' - ') || 'No category or address saved.'}
                  </p>
                  {place.notes ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{place.notes}</p> : null}
                  {place.url ? (
                    <a
                      href={place.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-black text-primary no-underline hover:text-secondary"
                    >
                      <ExternalLink className="size-4" />
                      Open link
                    </a>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${place.name}`}
                    onClick={() => openEditDialog(place)}
                  >
                    <Edit3 />
                  </Button>
                  <DeleteTripDetailItemAlertDialog
                    itemName={place.name}
                    title="Remove this saved place?"
                    description={
                      <>
                        This deletes <span className="font-black text-card-foreground">{place.name}</span> from your
                        saved places and removes its map pin from this trip.
                      </>
                    }
                    icon={<MapPin className="size-6" aria-hidden="true" />}
                    confirmLabel="Delete place"
                    decorationVariant="place"
                    onDelete={async () => {
                      try {
                        await deletePlace(trip.slug, place.id);
                        toast.success('Place deleted', {
                          description: `${place.name} was removed from this trip.`,
                        });
                        onRefresh();
                      } catch {
                        toast.error('Could not delete place', {
                          description: 'The place was not changed. Try again in a moment.',
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={!!editingPlace} onOpenChange={(open) => !open && setEditingPlaceId(null)}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
          <TripDialogHeader
            backgroundImageSrc="/pics/pexels-morais-90633.jpg"
            description="Update the selected place or address to refresh the saved map pin."
            emoji="🗺️"
            eyebrow="Places"
            title="Edit place"
          />
          <Form {...editForm}>
            <form onSubmit={handleEditPlaceSubmit}>
              <div className="max-h-[calc(100svh-16rem)] overflow-y-auto p-6">
                <PlaceFormFields form={editForm} />
              </div>
              <DialogFooter className="border-t border-border/70 bg-card/95 px-6 py-4">
                <Button type="submit" variant="gradient" size="pill" disabled={isUpdating}>
                  {isUpdating ? 'Finding pin...' : 'Save place'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </article>
  );
};
