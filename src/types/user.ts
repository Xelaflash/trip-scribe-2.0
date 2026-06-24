import type { Trip, User } from '@prisma/generated';

export interface UserWithTrips extends User {
  trips: Trip[];
}
