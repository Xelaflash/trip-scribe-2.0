import { trips } from './data/trips';
import { users } from './data/users';

import { PrismaClient } from '@prisma/generated';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data first
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  await prisma.user.createMany({
    data: users,
  });

  // Create trips
  await prisma.trip.createMany({
    data: trips,
  });
}

main()
  .catch((e) => {
    process.stderr.write(`${e instanceof Error ? (e.stack ?? e.message) : String(e)}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
