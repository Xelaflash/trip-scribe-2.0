import type { SelectedDestinationInput } from '@/lib/tripValidation';

type DestinationInput = string | SelectedDestinationInput;

export interface NormalizedTripDestination {
  label: string;
  mapboxId: string | null;
  featureType: string | null;
  latitude: number | null;
  longitude: number | null;
  sortOrder: number;
}

export const normalizeTripDestinations = (destinations: DestinationInput[]) => {
  const normalizedDestinations = destinations.flatMap((destination, index): NormalizedTripDestination[] => {
    const normalizedDestination =
      typeof destination === 'string'
        ? {
            label: destination,
            mapboxId: null,
            featureType: null,
            latitude: null,
            longitude: null,
          }
        : {
            label: destination.label,
            mapboxId: destination.mapboxId || null,
            featureType: destination.featureType || null,
            latitude: normalizeCoordinate(destination.latitude),
            longitude: normalizeCoordinate(destination.longitude),
          };
    const label = normalizedDestination.label.trim();

    if (!label) {
      return [];
    }

    return [
      {
        ...normalizedDestination,
        label,
        sortOrder: index,
      },
    ];
  });

  return {
    labels: normalizedDestinations.map((destination) => destination.label),
    records: normalizedDestinations,
  };
};

const normalizeCoordinate = (coordinate: number | null | undefined) => {
  return typeof coordinate === 'number' && Number.isFinite(coordinate) ? coordinate : null;
};
