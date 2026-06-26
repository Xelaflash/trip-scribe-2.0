import { trips } from './data/trips';
import { users } from './data/users';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/generated';

const databaseUrl =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/trip_scribe';
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction([
    prisma.trip.deleteMany(),
    prisma.user.deleteMany(),
    prisma.user.createMany({
      data: users,
    }),
    prisma.trip.createMany({
      data: trips,
    }),
  ]);
}

main()
  .catch((e) => {
    process.stderr.write(`${e instanceof Error ? (e.stack ?? e.message) : String(e)}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
