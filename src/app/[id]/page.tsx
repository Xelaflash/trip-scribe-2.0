import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const [{ id }, session] = await Promise.all([params, getServerSession(authOptions)]);

  if (!session || session.user.id !== id) {
    redirect('/');
  }

  redirect('/trips');
};

export default Page;
