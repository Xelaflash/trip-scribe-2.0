import { UserWithTrips } from '@/types/user';
import { User } from '@prisma/client';

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const users = (await res.json()) as UserWithTrips[];
  return users;
}

async function getCurrentUser(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
  const user = (await res.json()) as UserWithTrips;
  return user;
}

// Mutations
// update user
async function updateUser(id: string, data: Partial<User>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const user = (await res.json()) as UserWithTrips;
  return user;
}

// delete user

export { getUsers, getCurrentUser, updateUser };
