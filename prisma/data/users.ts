import { Role } from '@prisma/generated';
import { v4 as uuidv4 } from 'uuid';

export const users = [
  {
    id: uuidv4() as string,
    email: 'admin@admin.com',
    role: Role.ADMIN,
    name: 'Admin Admin',
  },
  {
    id: uuidv4() as string,
    email: 'usy@user.com',
    role: Role.USER,
    name: 'User User',
  },
  {
    id: uuidv4() as string,
    email: 'rien@rien.com',
    role: Role.USER,
    name: 'Jean Rien',
  },
];
