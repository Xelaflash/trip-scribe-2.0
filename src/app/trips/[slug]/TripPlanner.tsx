'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TripHeader } from '@/app/trips/[slug]/components/TripHeader';
import { TripItinerarySection } from '@/app/trips/[slug]/components/TripItinerarySection';
import { TripNotesSection } from '@/app/trips/[slug]/components/TripNotesSection';
import { TripOverviewSection } from '@/app/trips/[slug]/components/TripOverviewSection';
import { TripPlacesSection } from '@/app/trips/[slug]/components/TripPlacesSection';
import {
  itinerarySchema,
  noteSchema,
  overviewSchema,
  placeSchema,
  type ItineraryFormValues,
  type NoteFormValues,
  type OverviewFormValues,
  type PlaceFormValues,
} from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import { tripPlaceholderSets } from '@/app/trips/[slug]/data/placeholders';
import { deleteTrip, type TripWithDetails } from '@/queries/tripQueries';

function dateInputValue(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

function nextPlaceholderIndex(index: number) {
  return (index + 1) % tripPlaceholderSets.length;
}

export const TripPlanner = ({ trip }: { trip: TripWithDetails }) => {
  const router = useRouter();
  const [overviewPlaceholderIndex, setOverviewPlaceholderIndex] = useState(0);
  const [itineraryPlaceholderIndex, setItineraryPlaceholderIndex] = useState(1);
  const [notePlaceholderIndex, setNotePlaceholderIndex] = useState(2);

  const overviewForm = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {
      title: trip.title,
      description: trip.description ?? '',
      destinations: trip.destinations.join(', '),
      visibility: trip.visibility,
      startDate: dateInputValue(trip.startDate),
      endDate: dateInputValue(trip.endDate),
    },
  });
  const itineraryForm = useForm<ItineraryFormValues>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: { title: '', description: '', location: '', startsAt: '', endsAt: '' },
  });
  const noteForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', content: '' },
  });
  const placeForm = useForm<PlaceFormValues>({
    resolver: zodResolver(placeSchema),
    defaultValues: { name: '', category: '', address: '', url: '', notes: '' },
  });

  async function refresh() {
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <Link
        href="/trips"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary no-underline"
      >
        <ArrowLeft className="size-4" />
        Back to trips
      </Link>

      <TripHeader trip={trip} onDelete={() => deleteTrip(trip.slug).then(() => router.push('/trips'))} />

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <TripOverviewSection
          form={overviewForm}
          placeholders={tripPlaceholderSets[overviewPlaceholderIndex]}
          trip={trip}
          onPlaceholderChange={() => setOverviewPlaceholderIndex(nextPlaceholderIndex)}
          onRefresh={refresh}
        />
        <TripItinerarySection
          form={itineraryForm}
          placeholders={tripPlaceholderSets[itineraryPlaceholderIndex]}
          trip={trip}
          onPlaceholderChange={() => setItineraryPlaceholderIndex(nextPlaceholderIndex)}
          onRefresh={refresh}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TripNotesSection
          form={noteForm}
          placeholders={tripPlaceholderSets[notePlaceholderIndex]}
          trip={trip}
          onPlaceholderChange={() => setNotePlaceholderIndex(nextPlaceholderIndex)}
          onRefresh={refresh}
        />
        <TripPlacesSection form={placeForm} trip={trip} onRefresh={refresh} />
      </section>
    </main>
  );
};
