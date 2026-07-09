import { NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/geocoding';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { placeUpdateSchema } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string; placeId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { slug, placeId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const payload = placeUpdateSchema.parse(await request.json());
    const existingPlace = trip.places.find((place) => place.id === placeId);
    const nextAddress = payload.address === undefined ? undefined : normalizeOptionalText(payload.address);
    const existingAddress = normalizeOptionalText(existingPlace?.address);
    const shouldRefreshCoordinates = nextAddress !== undefined && nextAddress !== existingAddress;
    const geocodedPlace = !shouldRefreshCoordinates
      ? undefined
      : await geocodeAddress({
          address: nextAddress,
          destinations: trip.destinations,
        });
    const place = await prisma.tripPlace.update({
      where: { id_tripId: { id: placeId, tripId: trip.id } },
      data: {
        ...payload,
        category: payload.category === undefined ? undefined : payload.category || null,
        address: payload.address === undefined ? undefined : payload.address || null,
        url: payload.url === undefined ? undefined : payload.url || null,
        notes: payload.notes === undefined ? undefined : payload.notes || null,
        latitude: geocodedPlace === undefined ? undefined : (geocodedPlace?.latitude ?? null),
        longitude: geocodedPlace === undefined ? undefined : (geocodedPlace?.longitude ?? null),
      },
    });

    return NextResponse.json(place);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}

const normalizeOptionalText = (value: string | null | undefined) => {
  const trimmedValue = value?.trim();
  return trimmedValue || null;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug, placeId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    await prisma.tripPlace.delete({ where: { id_tripId: { id: placeId, tripId: trip.id } } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
