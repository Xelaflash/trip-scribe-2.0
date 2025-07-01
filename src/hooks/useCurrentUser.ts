'use client';

import { getCurrentUser } from '@/queries/userQueries';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const useCurrentUser = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data: currentUser } = useQuery({
    queryKey: ['currentUserQuery', userId],
    queryFn: async () => userId && (await getCurrentUser(userId)),
    enabled: status === 'authenticated' && !!userId,
  });

  return currentUser;
};

export { useCurrentUser };
