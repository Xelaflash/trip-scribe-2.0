import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { noteUpdateSchema } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string; noteId: string }>;
};

/** Updates an owned trip note and maps validation/not-found failures to client-safe responses. */
export async function PATCH(request: Request, context: RouteContext) {
  const { slug, noteId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const payload = noteUpdateSchema.parse(await request.json());
    const note = await prisma.tripNote.update({
      where: { id_tripId: { id: noteId, tripId: trip.id } },
      data: payload,
    });

    return NextResponse.json(note);
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

/** Deletes an owned trip note, returning not found when the scoped note does not exist. */
export async function DELETE(_request: Request, context: RouteContext) {
  const { slug, noteId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    await prisma.tripNote.delete({ where: { id_tripId: { id: noteId, tripId: trip.id } } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
