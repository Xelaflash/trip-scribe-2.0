import { z } from 'zod';
import type { UseFormReturn } from 'react-hook-form';

export const overviewSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  destinations: z.string().min(2),
  visibility: z.enum(['PRIVATE', 'PUBLIC']),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export const itinerarySchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const noteSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
});

export const placeSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  address: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional(),
});

export type OverviewFormValues = z.infer<typeof overviewSchema>;
export type ItineraryFormValues = z.infer<typeof itinerarySchema>;
export type NoteFormValues = z.infer<typeof noteSchema>;
export type PlaceFormValues = z.infer<typeof placeSchema>;

export type OverviewForm = UseFormReturn<OverviewFormValues>;
export type ItineraryForm = UseFormReturn<ItineraryFormValues>;
export type NoteForm = UseFormReturn<NoteFormValues>;
export type PlaceForm = UseFormReturn<PlaceFormValues>;
