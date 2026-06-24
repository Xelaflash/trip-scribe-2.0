import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TripsDashboard } from '@/app/trips/trips-dashboard';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function TripsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  return <TripsDashboard userName={session.user.name ?? 'Traveler'} />;
}
