import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// export async function GET(request: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return new NextResponse('Unauthorized', { status: 401 });
//   }

//   const users = await prisma.user.findMany();
//   return NextResponse.json(users);
// }

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const json = await request.json();

    const user = await prisma.user.create({
      data: json,
    });

    return new NextResponse(JSON.stringify(user), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      // Handle Prisma unique constraint violation
      if ('code' in error && error.code === 'P2002') {
        return new NextResponse('User with email already exists', {
          status: 409,
        });
      }
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}
