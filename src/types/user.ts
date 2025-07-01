import type { Trip, User } from '@prisma/client';

export interface UserWithTrips extends User {
  trips: Trip[];
}
