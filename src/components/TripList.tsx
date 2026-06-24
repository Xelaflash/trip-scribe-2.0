'use client';
import type * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Trip } from '@prisma/generated';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const TripList = ({ userTrips }: { userTrips: Trip[] }) => {
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  // const [trips, setTrips] = useState<Trip[]>(userTrips);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  // const filteredTrips = trips?.filter((trip) => trip.title.toLowerCase().includes(filterText.toLowerCase()));

  const handleTripRowClick = (trip: Trip) => {
    router.push(`/trips/${trip.slug}`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[75%]">
        <div className="flex justify-end items-center px-4 py-2">
          <input
            className="border rounded-lg px-3 py-1"
            placeholder="Filter..."
            type="text"
            value={filterText}
            onChange={handleFilterChange}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Destinations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userTrips?.map((trip) => (
              <TableRow key={trip.id} onClick={() => handleTripRowClick(trip)}>
                <TableCell className="font-medium">{trip.title}</TableCell>
                <TableCell>
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{trip.destinations.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { TripList };
