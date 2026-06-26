import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      trips: true,
    },
  });

  if (!user) {
    return new NextResponse('No user with ID found', { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request, context: RouteContext) {
  const [{ id }, json] = await Promise.all([context.params, request.json()]);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: json,
  });

  if (!updatedUser) {
    return new NextResponse('No user with ID found', { status: 404 });
  }

  return NextResponse.json(updatedUser);
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'P2025') {
        return new NextResponse('No user with ID found', { status: 404 });
      }
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}
