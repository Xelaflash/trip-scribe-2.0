import { Trip } from '@prisma/client';

async function createTrip(data: Trip) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const trip = (await res.json()) as Trip;
  return trip;
}

export { createTrip };
