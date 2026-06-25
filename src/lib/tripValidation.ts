import { z } from 'zod';

export const visibilitySchema = z.enum(['PRIVATE', 'PUBLIC']);

export const tripCreateSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters.'),
  description: z.string().trim().optional().or(z.literal('')),
  destinations: z.array(z.string().trim().min(1)).min(1, 'Add at least one destination.'),
  visibility: visibilitySchema.default('PRIVATE'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const tripUpdateSchema = tripCreateSchema.partial();

const optionalDateSchema = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? null : value),
  z.coerce.date().nullable(),
);

export const itineraryCreateSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters.'),
  description: z.string().trim().optional().or(z.literal('')),
  location: z.string().trim().optional().or(z.literal('')),
  startsAt: optionalDateSchema,
  endsAt: optionalDateSchema,
  sortOrder: z.coerce.number().int().default(0),
});

export const itineraryUpdateSchema = itineraryCreateSchema.partial();

export const noteCreateSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters.'),
  content: z.string().trim().min(1, 'Note content is required.'),
});

export const noteUpdateSchema = noteCreateSchema.partial();

export const placeCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  category: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  url: z.string().trim().url('Enter a valid URL.').optional().or(z.literal('')),
  notes: z.string().trim().optional().or(z.literal('')),
});

export const placeUpdateSchema = placeCreateSchema.partial();

export type TripCreateInput = z.infer<typeof tripCreateSchema>;
export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
export type ItineraryCreateInput = z.infer<typeof itineraryCreateSchema>;
export type ItineraryUpdateInput = z.infer<typeof itineraryUpdateSchema>;
export type NoteCreateInput = z.infer<typeof noteCreateSchema>;
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>;
export type PlaceCreateInput = z.infer<typeof placeCreateSchema>;
export type PlaceUpdateInput = z.infer<typeof placeUpdateSchema>;
