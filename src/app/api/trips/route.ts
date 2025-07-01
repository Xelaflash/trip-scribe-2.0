import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const json = await request.json();

    const trip = await prisma.trip.create({
      data: {
        ...json,
        user: { connect: { id: session.user.id } },
        slug: json.title.toLowerCase().replace(/ /g, '-'),
        id: crypto.randomUUID(),
      },
    });

    return new NextResponse(JSON.stringify(trip), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}
