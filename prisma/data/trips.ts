import { users } from './users';
import { Visibility } from '@prisma/generated';
import { v4 as uuidv4 } from 'uuid';

export const trips = [
  {
    id: uuidv4() as string,
    title: 'Trip 1',
    visibility: Visibility.PUBLIC,
    slug: 'trip-1-public',
    userId: users[0].id,
    destinations: ['paris france', 'london uk'],
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-15'),
  },
  {
    id: uuidv4() as string,
    title: 'Trip 2 PRIVATE',
    visibility: Visibility.PRIVATE,
    slug: 'trip--2-private',
    userId: users[0].id,
    destinations: ['NYC USA', 'Los Angeles USA'],
    startDate: new Date('2023-03-15'),
    endDate: new Date('2023-03-30'),
  },
  {
    id: uuidv4() as string,
    title: 'Trip 3',
    visibility: Visibility.PUBLIC,
    slug: 'trip-3-public',
    userId: users[1].id,
    destinations: ['Singapour ', 'Saigon Vietnam'],
    startDate: new Date('2022-11-01'),
    endDate: new Date('2022-12-30'),
  },
  {
    id: uuidv4() as string,
    title: 'Trip 4',
    visibility: Visibility.PRIVATE,
    slug: 'trip-4-private',
    userId: users[1].id,
    destinations: ['Tokyo Japan', 'Osaka Japan'],
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-05-08'),
  },
];
