import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { itineraryUpdateSchema } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string; itemId: string }>;
};

/** Updates an owned itinerary item and maps validation/not-found failures to client-safe responses. */
export async function PATCH(request: Request, context: RouteContext) {
  const { slug, itemId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const payload = itineraryUpdateSchema.parse(await request.json());
    const item = await prisma.itineraryItem.update({
      where: { id_tripId: { id: itemId, tripId: trip.id } },
      data: {
        ...payload,
        description: payload.description === undefined ? undefined : payload.description || null,
        location: payload.location === undefined ? undefined : payload.location || null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse('Internal server error', { status: 500 });
  }
}

/** Deletes an owned itinerary item, returning not found when the scoped item does not exist. */
export async function DELETE(_request: Request, context: RouteContext) {
  const { slug, itemId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    await prisma.itineraryItem.delete({ where: { id_tripId: { id: itemId, tripId: trip.id } } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
