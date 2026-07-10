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
import type { SelectedDestinationInput } from '@/lib/tripValidation';
import { deleteTrip, type TripWithDetails } from '@/queries/tripQueries';

const dateInputValue = (value: Date | string) => {
  return new Date(value).toISOString().slice(0, 10);
};

const nextPlaceholderIndex = (index: number) => {
  return (index + 1) % tripPlaceholderSets.length;
};

const tripDestinationDefaults = (trip: TripWithDetails): SelectedDestinationInput[] => {
  if (trip.tripDestinations.length > 0) {
    return trip.tripDestinations.map((destination) => ({
      label: destination.label,
      mapboxId: destination.mapboxId ?? undefined,
      featureType: destination.featureType ?? undefined,
      latitude: destination.latitude,
      longitude: destination.longitude,
    }));
  }

  return trip.destinations.map((destination) => ({ label: destination }));
};

export const TripPlanner = ({ trip }: { trip: TripWithDetails }) => {
  const router = useRouter();
  const [overviewPlaceholderIndex, setOverviewPlaceholderIndex] = useState(0);
  const [itineraryPlaceholderIndex, setItineraryPlaceholderIndex] = useState(1);
  const [notePlaceholderIndex, setNotePlaceholderIndex] = useState(2);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);

  const overviewForm = useForm<OverviewFormValues>({
    resolver: zodResolver(overviewSchema),
    defaultValues: {
      title: trip.title,
      description: trip.description ?? '',
      destinations: tripDestinationDefaults(trip),
      visibility: trip.visibility,
      planningStatus: trip.planningStatus,
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
    defaultValues: {
      name: '',
      category: '',
      address: '',
      mapboxId: '',
      featureType: '',
      latitude: null,
      longitude: null,
      url: '',
      notes: '',
    },
  });

  const refresh = async () => {
    router.refresh();
  };

  const handleDeleteTrip = async () => {
    setIsDeletingTrip(true);

    try {
      await deleteTrip(trip.slug);
      router.push('/trips');
    } finally {
      setIsDeletingTrip(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-outerContentWidth flex-col gap-8 px-viewportPadding py-10 lg:py-12">
      <Link
        href="/trips"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-black text-primary no-underline shadow-xs transition hover:border-ring hover:bg-muted"
      >
        <ArrowLeft className="size-4" />
        Back to trips
      </Link>

      <TripHeader trip={trip} isDeletingTrip={isDeletingTrip} onDeleteTrip={handleDeleteTrip} />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
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

      <section className="flex flex-col gap-6">
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
