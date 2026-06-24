import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TripDetailClient } from '@/app/trips/[slug]/trip-detail-client';
import prisma from '@/lib/prisma';
import { tripInclude } from '@/lib/tripServer';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

const TripDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const [{ slug }, session] = await Promise.all([params, getServerSession(authOptions)]);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const trip = await prisma.trip.findFirst({
    where: {
      slug,
      userId: session.user.id,
    },
    include: tripInclude,
  });

  if (!trip) {
    notFound();
  }

  return <TripDetailClient trip={trip} />;
};

export default TripDetailPage;
