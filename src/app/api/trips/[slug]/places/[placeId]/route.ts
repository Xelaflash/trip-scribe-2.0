import { NextResponse } from 'next/server';
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
    const place = await prisma.tripPlace.update({
      where: { id_tripId: { id: placeId, tripId: trip.id } },
      data: {
        ...payload,
        category: payload.category === undefined ? undefined : payload.category || null,
        address: payload.address === undefined ? undefined : payload.address || null,
        url: payload.url === undefined ? undefined : payload.url || null,
        notes: payload.notes === undefined ? undefined : payload.notes || null,
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
