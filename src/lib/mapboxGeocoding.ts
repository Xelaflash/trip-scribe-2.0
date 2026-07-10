interface MapboxGeocodingFeature {
  geometry?: {
    coordinates?: [number, number];
  };
  properties?: {
    full_address?: string;
    name?: string;
    mapbox_id?: string;
    feature_type?: string;
  };
}

interface MapboxGeocodingResponse {
  features?: MapboxGeocodingFeature[];
}

export interface MapboxGeocodedPlace {
  address: string | null;
  latitude: number;
  longitude: number;
  mapboxId: string | null;
  featureType: string | null;
}

const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/search/geocode/v6/forward';

export const geocodeAddressWithMapbox = async ({
  address,
  destinations,
}: {
  address: string | null | undefined;
  destinations: string[];
}) => {
  const token = process.env.MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const trimmedAddress = address?.trim();

  if (!token || !trimmedAddress) {
    return null;
  }

  const query = [trimmedAddress, ...destinations].filter(Boolean).join(', ');

  try {
    const url = new URL(MAPBOX_GEOCODING_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('access_token', token);
    url.searchParams.set('permanent', 'true');
    url.searchParams.set('limit', '1');
    url.searchParams.set('language', 'en');
    url.searchParams.set('types', 'address,street,place,locality,neighborhood');

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as MapboxGeocodingResponse;
    const feature = results.features?.[0];
    const [longitude, latitude] = feature?.geometry?.coordinates ?? [];

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    return {
      address: feature?.properties?.full_address || feature?.properties?.name || null,
      latitude,
      longitude,
      mapboxId: feature?.properties?.mapbox_id || null,
      featureType: feature?.properties?.feature_type || null,
    } satisfies MapboxGeocodedPlace;
  } catch {
    return null;
  }
};
