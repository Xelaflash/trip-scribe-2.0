'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Plus, Route, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  itinerarySchema,
  type ItineraryForm,
  type ItineraryFormValues,
} from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createItineraryItem, deleteItineraryItem, updateItineraryItem } from '@/queries/tripQueries';

/** Formats a stored date for a datetime-local input without shifting the local wall-clock time. */
const dateTimeInputValue = (value: Date | string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const pad = (part: number) => part.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const editForm = useForm<ItineraryFormValues>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: { title: '', description: '', location: '', startsAt: '', endsAt: '' },
  });

  const editingItem = trip.itineraryItems.find((item) => item.id === editingItemId);
  const isCreating = form.formState.isSubmitting;
  const isUpdating = editForm.formState.isSubmitting;

  const openEditDialog = (item: TripWithDetails['itineraryItems'][number]) => {
    editForm.reset({
      title: item.title,
      description: item.description ?? '',
      location: item.location ?? '',
      startsAt: dateTimeInputValue(item.startsAt),
      endsAt: dateTimeInputValue(item.endsAt),
    });
    setEditingItemId(item.id);
  };

  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-elevationLow">
      <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-primary-950">
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
          <Button type="submit" size="sm" disabled={isCreating}>
            <Plus />
            {isCreating ? 'Adding item...' : 'Add itinerary item'}
          </Button>
        </form>
      </Form>
      <div className="mt-5 grid gap-3">
        {trip.itineraryItems.length === 0 ? (
          <p className="rounded-md border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
            No itinerary items yet.
          </p>
        ) : null}
        {trip.itineraryItems.map((item) => (
          <div key={item.id} className="rounded-md border border-border bg-white p-3">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="m-0 text-base font-bold text-primary-950">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.startsAt ? new Date(item.startsAt).toLocaleString() : 'No date set'}
                  {item.endsAt ? ` - ${new Date(item.endsAt).toLocaleString()}` : ''}
                </p>
                {item.location ? <p className="text-sm text-muted-foreground">{item.location}</p> : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${item.title}`}
                onClick={() => openEditDialog(item)}
              >
                <Edit3 />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${item.title}`}
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
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItemId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit itinerary item</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              className="grid gap-3"
              onSubmit={editForm.handleSubmit(async (values) => {
                if (!editingItem) {
                  return;
                }

                await updateItineraryItem(trip.slug, editingItem.id, {
                  ...values,
                  startsAt: values.startsAt ? new Date(values.startsAt) : null,
                  endsAt: values.endsAt ? new Date(values.endsAt) : null,
                });
                setEditingItemId(null);
                onRefresh();
              })}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => <Input placeholder={placeholders.itineraryTitle} {...field} />}
                />
                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => <Input placeholder={placeholders.itineraryLocation} {...field} />}
                />
                <FormField
                  control={editForm.control}
                  name="startsAt"
                  render={({ field }) => <Input type="datetime-local" {...field} />}
                />
                <FormField
                  control={editForm.control}
                  name="endsAt"
                  render={({ field }) => <Input type="datetime-local" {...field} />}
                />
              </div>
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => <Textarea placeholder={placeholders.itineraryDescription} {...field} />}
              />
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving item...' : 'Save itinerary item'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </article>
  );
};
