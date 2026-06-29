import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { noteCreateSchema } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/** Creates a note for an owned trip and returns sanitized validation failures to the client. */
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
    if (error instanceof ZodError) {
      return NextResponse.json({ issues: error.issues }, { status: 400 });
    }

    return new NextResponse('Internal server error', { status: 500 });
  }
}
