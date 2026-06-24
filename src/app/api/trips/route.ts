import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createUniqueTripSlug, requireUserSession } from '@/lib/tripServer';
import { tripCreateSchema } from '@/lib/tripValidation';

export async function GET() {
  const session = await requireUserSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { startDate: 'asc' },
  });

  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  const session = await requireUserSession();
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const payload = tripCreateSchema.parse(await request.json());
    const slug = await createUniqueTripSlug(payload.title);

    const trip = await prisma.trip.create({
      data: {
        ...payload,
        description: payload.description || null,
        user: { connect: { id: session.user.id } },
        slug,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}
