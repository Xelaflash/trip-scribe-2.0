import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export const tripInclude = {
  itineraryItems: {
    orderBy: [{ startsAt: 'asc' as const }, { sortOrder: 'asc' as const }],
  },
  notes: {
    orderBy: { updatedAt: 'desc' as const },
  },
  places: {
    orderBy: { name: 'asc' as const },
  },
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

export async function createUniqueTripSlug(title: string, ignoreTripId?: string) {
  const baseSlug = slugify(title) || 'trip';
  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.trip.findFirst({
      where: {
        slug,
        ...(ignoreTripId ? { id: { not: ignoreTripId } } : {}),
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function requireUserSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return session;
}

export async function requireOwnedTrip(slug: string) {
  const session = await requireUserSession();

  if (!session) {
    return { session: null, trip: null };
  }

  const trip = await prisma.trip.findFirst({
    where: {
      slug,
      userId: session.user.id,
    },
    include: tripInclude,
  });

  return { session, trip };
}
