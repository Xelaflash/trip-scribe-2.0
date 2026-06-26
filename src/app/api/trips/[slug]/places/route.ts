import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { placeCreateSchema } from '@/lib/tripValidation';

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
    const place = await prisma.tripPlace.create({
      data: {
        ...payload,
        category: payload.category || null,
        address: payload.address || null,
        url: payload.url || null,
        notes: payload.notes || null,
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
