import { NextResponse } from 'next/server';
import { geocodeAddressWithMapbox } from '@/lib/mapboxGeocoding';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { placeCreateSchema, type PlaceCreateInput } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const payload = placeCreateSchema.parse(await request.json());
    const selectedCoordinates = getSelectedCoordinates(payload);
    const geocodedPlace = selectedCoordinates
      ? null
      : await geocodeAddressWithMapbox({
          address: payload.address,
          destinations: trip.destinations,
        });
    const place = await prisma.tripPlace.create({
      data: {
        ...payload,
        category: payload.category || null,
        address: geocodedPlace?.address || payload.address || null,
        mapboxId: payload.mapboxId || geocodedPlace?.mapboxId || null,
        featureType: payload.featureType || geocodedPlace?.featureType || null,
        url: payload.url || null,
        notes: payload.notes || null,
        latitude: selectedCoordinates?.latitude ?? geocodedPlace?.latitude ?? null,
        longitude: selectedCoordinates?.longitude ?? geocodedPlace?.longitude ?? null,
        tripId: trip.id,
      },
    });

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}

const getSelectedCoordinates = (payload: Pick<PlaceCreateInput, 'latitude' | 'longitude'>) => {
  if (typeof payload.latitude !== 'number' || typeof payload.longitude !== 'number') {
    return null;
  }

  return {
    latitude: payload.latitude,
    longitude: payload.longitude,
  };
};
