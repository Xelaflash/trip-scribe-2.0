import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { noteCreateSchema } from '@/lib/tripValidation';

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
    const payload = noteCreateSchema.parse(await request.json());
    const note = await prisma.tripNote.create({
      data: {
        ...payload,
        tripId: trip.id,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}
