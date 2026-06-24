import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireOwnedTrip } from '@/lib/tripServer';
import { noteUpdateSchema } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string; noteId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { slug, noteId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  const payload = noteUpdateSchema.parse(await request.json());
  const note = await prisma.tripNote.update({
    where: { id_tripId: { id: noteId, tripId: trip.id } },
    data: payload,
  });

  return NextResponse.json(note);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug, noteId } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  await prisma.tripNote.delete({ where: { id_tripId: { id: noteId, tripId: trip.id } } });

  return new NextResponse(null, { status: 204 });
}
