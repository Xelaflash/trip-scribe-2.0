import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { itineraryUpdateSchema } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string; itemId: string }>;
};

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
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}

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
