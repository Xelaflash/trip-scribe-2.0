import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createUniqueTripSlug, requireOwnedTrip, requireUserSession, tripInclude } from '@/lib/tripServer';
import { tripUpdateSchema } from '@/lib/tripValidation';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const session = await requireUserSession();

  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: tripInclude,
  });

  if (!trip || (trip.visibility === 'PRIVATE' && trip.userId !== session?.user.id)) {
    return new NextResponse('Not found', { status: 404 });
  }

  return NextResponse.json(trip);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const payload = tripUpdateSchema.parse(await request.json());
    const nextSlug = payload.title ? await createUniqueTripSlug(payload.title, trip.id) : trip.slug;

    const updatedTrip = await prisma.trip.update({
      where: { id: trip.id },
      data: {
        ...payload,
        description: payload.description === undefined ? undefined : payload.description || null,
        slug: nextSlug,
      },
      include: tripInclude,
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { trip } = await requireOwnedTrip(slug);

  if (!trip) {
    return new NextResponse('Not found', { status: 404 });
  }

  await prisma.trip.delete({ where: { id: trip.id } });

  return new NextResponse(null, { status: 204 });
}
