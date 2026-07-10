import { trips } from './data/trips';
import { users } from './data/users';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/generated';
import { normalizeTripDestinations } from '../src/lib/tripDestinations';

const databaseUrl =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/trip_scribe';
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction(
    async (tx) => {
      await tx.trip.deleteMany();
      await tx.user.deleteMany();
      await tx.user.createMany({
        data: users,
      });

      const seedTrips = trips.map(({ itineraryItems, notes, places, destinations, ...trip }) => {
        const normalizedDestinations = normalizeTripDestinations(destinations);

        return {
          trip: {
            ...trip,
            destinations: normalizedDestinations.labels,
          },
          itineraryItems,
          notes,
          places,
          tripDestinations: normalizedDestinations.records,
        };
      });

      await tx.trip.createMany({
        data: seedTrips.map(({ trip }) => trip),
      });

      await tx.tripDestination.createMany({
        data: seedTrips.flatMap(({ trip, tripDestinations }) =>
          tripDestinations.map((destination) => ({
            ...destination,
            tripId: trip.id,
          })),
        ),
      });

      await tx.itineraryItem.createMany({
        data: seedTrips.flatMap(({ trip, itineraryItems }) =>
          itineraryItems.map((item) => ({
            ...item,
            tripId: trip.id,
          })),
        ),
      });

      await tx.tripNote.createMany({
        data: seedTrips.flatMap(({ trip, notes }) =>
          notes.map((note) => ({
            ...note,
            tripId: trip.id,
          })),
        ),
      });

      await tx.tripPlace.createMany({
        data: seedTrips.flatMap(({ trip, places }) =>
          places.map((place) => ({
            ...place,
            tripId: trip.id,
          })),
        ),
      });
    },
    { timeout: 20_000 },
  );
}

main()
  .catch((e) => {
    process.stderr.write(`${e instanceof Error ? (e.stack ?? e.message) : String(e)}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
