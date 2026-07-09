'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Edit3, Plus, Route, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { TripDialogHeader } from '@/app/trips/[slug]/components/TripDialogHeader';
import {
  itinerarySchema,
  type ItineraryForm,
  type ItineraryFormValues,
} from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import { cn } from '@/lib/utils';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createItineraryItem, deleteItineraryItem, updateItineraryItem } from '@/queries/tripQueries';

/** Formats a stored date for form fields without shifting the local wall-clock time. */
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

const datePartValue = (value: string | undefined) => value?.split(/[T\s]/)[0] ?? '';

const timePartValue = (value: string | undefined) => {
  const timePart = value?.split(/[T\s]/)[1];

  return timePart?.slice(0, 5) ?? '';
};

const combineDateTimeValue = (datePart: string, timePart: string) => {
  if (!datePart) {
    return timePart ? `T${timePart}` : '';
  }

  return timePart ? `${datePart}T${timePart}` : datePart;
};

const parseDateValue = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
};

const dateTimePayloadValue = (value: string | undefined) => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return new Date(trimmedValue.includes('T') ? trimmedValue : trimmedValue.replace(/\s+/, 'T'));
};

const formatDateBadge = (value: Date | string | null) => {
  if (!value) {
    return 'TBD';
  }

  const date = new Date(value);

  return date
    .toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
    .toUpperCase()
    .replace(' ', '\n');
};

const formatTimeRange = (startsAt: Date | string | null, endsAt: Date | string | null) => {
  if (!startsAt && !endsAt) {
    return 'No date set';
  }

  const formatTime = (value: Date | string) =>
    new Date(value).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });

  if (startsAt && endsAt) {
    return `${formatTime(startsAt)} - ${formatTime(endsAt)}`;
  }

  return startsAt ? formatTime(startsAt) : `Ends ${formatTime(endsAt as Date | string)}`;
};

interface ItineraryFormFieldsProps {
  form: ItineraryForm;
  placeholders: TripPlaceholderSet;
}

const ItineraryDateTimeField = ({
  field,
  label,
  placeholder,
}: {
  field: {
    name: string;
    value?: string;
    onBlur: () => void;
    onChange: (value: string) => void;
  };
  label: string;
  placeholder: string;
}) => {
  const datePart = datePartValue(field.value);
  const timePart = timePartValue(field.value);
  const selectedDate = datePart ? parseDateValue(datePart) : undefined;

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8.5rem]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                name={field.name}
                type="button"
                data-empty={!selectedDate}
                className={cn(
                  'h-12 w-full justify-start rounded-2xl border-border/80 bg-card/80 px-4 text-left font-semibold shadow-xs transition-colors hover:bg-muted/70 data-[empty=true]:text-muted-foreground dark:hover:bg-ink-700',
                )}
                onBlur={field.onBlur}
              >
                <CalendarIcon className="mr-2 size-5 shrink-0 text-primary" aria-hidden="true" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto rounded-2xl border-border/80 bg-card p-0 shadow-elevationMedium"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) =>
                  field.onChange(combineDateTimeValue(date ? format(date, 'yyyy-MM-dd') : '', timePart))
                }
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <div className="relative">
            <Clock
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-primary"
              aria-hidden="true"
            />
            <Input
              aria-label={`${label} time`}
              className="h-12 w-full rounded-2xl border-border/80 bg-card/80 px-4 pl-11 text-left font-semibold shadow-xs transition-colors hover:bg-muted/70 data-[empty=true]:text-muted-foreground dark:hover:bg-ink-700 [&::-webkit-calendar-picker-indicator]:opacity-0"
              data-empty={!timePart}
              type="time"
              value={timePart}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(combineDateTimeValue(datePart, event.target.value))}
            />
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

const ItineraryFormFields = ({ form, placeholders }: ItineraryFormFieldsProps) => (
  <div className="grid gap-4">
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-black shadow-xs"
                placeholder={placeholders.itineraryTitle}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input
                className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
                placeholder={placeholders.itineraryLocation}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="startsAt"
        render={({ field }) => <ItineraryDateTimeField field={field} label="Starts" placeholder="Start date" />}
      />
      <FormField
        control={form.control}
        name="endsAt"
        render={({ field }) => <ItineraryDateTimeField field={field} label="Ends" placeholder="End date" />}
      />
    </div>
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              className="min-h-28 rounded-2xl border-border/80 bg-card/80 px-4 py-3 font-medium shadow-xs"
              placeholder={placeholders.itineraryDescription}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
    <article className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationLow backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 flex items-center gap-2 text-2xl font-black tracking-normal text-card-foreground">
          <Route className="size-6 text-primary" />
          Itinerary
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="pill">
              <Plus />
              Add item
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
            <TripDialogHeader
              description="Place an idea, booking, or timed stop on this trip timeline."
              emoji="🧭"
              eyebrow="Timeline"
              title="Add itinerary item"
            />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  await createItineraryItem(trip.slug, {
                    ...values,
                    startsAt: dateTimePayloadValue(values.startsAt),
                    endsAt: dateTimePayloadValue(values.endsAt),
                    sortOrder: trip.itineraryItems.length,
                  });
                  form.reset();
                  setIsCreateDialogOpen(false);
                  onPlaceholderChange();
                  onRefresh();
                })}
              >
                <div className="p-6">
                  <ItineraryFormFields form={form} placeholders={placeholders} />
                </div>
                <DialogFooter className="border-t border-border/70 bg-card/95 px-6 py-4">
                  <Button type="submit" variant="gradient" size="pill" disabled={isCreating}>
                    {isCreating ? 'Adding item...' : 'Add item'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4">
        {trip.itineraryItems.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-muted/70 p-5 text-sm font-semibold text-muted-foreground">
            No itinerary items yet.
          </p>
        ) : null}
        {trip.itineraryItems.map((item) => (
          <article
            key={item.id}
            className="grid gap-4 rounded-3xl border border-border/80 bg-background/70 p-4 shadow-xs sm:grid-cols-[4.75rem_1fr_auto] sm:items-center"
          >
            <span className="grid size-16 place-items-center whitespace-pre-line rounded-3xl bg-[linear-gradient(135deg,var(--button-primary-gradient-from),var(--button-primary-gradient-to))] text-center text-xs leading-tight font-black text-white shadow-[0_14px_30px_var(--button-primary-shadow)]">
              {formatDateBadge(item.startsAt)}
            </span>
            <div className="min-w-0">
              <h3 className="m-0 text-xl font-black tracking-normal text-foreground">{item.title}</h3>
              {item.location ? (
                <p className="mt-1 text-base font-medium text-muted-foreground">{item.location}</p>
              ) : null}
              <p className="mt-1 text-sm font-black text-muted-foreground">
                {formatTimeRange(item.startsAt, item.endsAt)}
              </p>
              {item.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
            <div className="flex gap-1 sm:justify-end">
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
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${item.title}`}
                onClick={async () => {
                  await deleteItineraryItem(trip.slug, item.id);
                  onRefresh();
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItemId(null)}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <TripDialogHeader
            description="Update the timing, place, or notes for this timeline item."
            emoji="🗓️"
            eyebrow="Timeline"
            title="Edit itinerary item"
          />
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(async (values) => {
                if (!editingItem) {
                  return;
                }

                await updateItineraryItem(trip.slug, editingItem.id, {
                  ...values,
                  startsAt: dateTimePayloadValue(values.startsAt),
                  endsAt: dateTimePayloadValue(values.endsAt),
                });
                setEditingItemId(null);
                onRefresh();
              })}
            >
              <div className="p-6">
                <ItineraryFormFields form={editForm} placeholders={placeholders} />
              </div>
              <DialogFooter className="border-t border-border/70 bg-card/95 px-6 py-4">
                <Button type="submit" variant="gradient" size="pill" disabled={isUpdating}>
                  {isUpdating ? 'Saving item...' : 'Save item'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </article>
  );
};
