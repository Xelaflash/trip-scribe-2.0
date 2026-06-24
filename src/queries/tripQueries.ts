import type { Prisma, Trip } from '@prisma/generated';
import type {
  ItineraryCreateInput,
  ItineraryUpdateInput,
  NoteCreateInput,
  NoteUpdateInput,
  PlaceCreateInput,
  PlaceUpdateInput,
  TripCreateInput,
  TripUpdateInput,
} from '@/lib/tripValidation';

export type TripWithDetails = Prisma.TripGetPayload<{
  include: {
    itineraryItems: true;
    notes: true;
    places: true;
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
  };
}>;

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export async function getTrips() {
  return requestJson<Trip[]>('/api/trips');
}

export async function getTrip(slug: string) {
  return requestJson<TripWithDetails>(`/api/trips/${slug}`);
}

export async function createTrip(data: TripCreateInput) {
  return requestJson<Trip>('/api/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTrip(slug: string, data: TripUpdateInput) {
  return requestJson<TripWithDetails>(`/api/trips/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTrip(slug: string) {
  return requestJson<void>(`/api/trips/${slug}`, {
    method: 'DELETE',
  });
}

export async function createItineraryItem(slug: string, data: ItineraryCreateInput) {
  return requestJson<TripWithDetails['itineraryItems'][number]>(`/api/trips/${slug}/itinerary`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateItineraryItem(slug: string, itemId: string, data: ItineraryUpdateInput) {
  return requestJson<TripWithDetails['itineraryItems'][number]>(`/api/trips/${slug}/itinerary/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteItineraryItem(slug: string, itemId: string) {
  return requestJson<void>(`/api/trips/${slug}/itinerary/${itemId}`, {
    method: 'DELETE',
  });
}

export async function createNote(slug: string, data: NoteCreateInput) {
  return requestJson<TripWithDetails['notes'][number]>(`/api/trips/${slug}/notes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateNote(slug: string, noteId: string, data: NoteUpdateInput) {
  return requestJson<TripWithDetails['notes'][number]>(`/api/trips/${slug}/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteNote(slug: string, noteId: string) {
  return requestJson<void>(`/api/trips/${slug}/notes/${noteId}`, {
    method: 'DELETE',
  });
}

export async function createPlace(slug: string, data: PlaceCreateInput) {
  return requestJson<TripWithDetails['places'][number]>(`/api/trips/${slug}/places`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePlace(slug: string, placeId: string, data: PlaceUpdateInput) {
  return requestJson<TripWithDetails['places'][number]>(`/api/trips/${slug}/places/${placeId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deletePlace(slug: string, placeId: string) {
  return requestJson<void>(`/api/trips/${slug}/places/${placeId}`, {
    method: 'DELETE',
  });
}
