interface GeocodedPlace {
  latitude: number;
  longitude: number;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
}

const NOMINATIM_SEARCH_URL = process.env.NOMINATIM_SEARCH_URL || 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_USER_AGENT =
  process.env.NOMINATIM_USER_AGENT || `Trip Scribe 2.0 (${process.env.NEXTAUTH_URL || 'local development'})`;
const MIN_REQUEST_INTERVAL_MS = 1100;

let lastRequestAt = 0;
let requestQueue = Promise.resolve();
const geocodeCache = new Map<string, GeocodedPlace | null>();

export const geocodeAddress = async ({
  address,
  destinations,
}: {
  address: string | null | undefined;
  destinations: string[];
}) => {
  const trimmedAddress = address?.trim();

  if (!trimmedAddress) {
    return null;
  }

  const query = [trimmedAddress, ...destinations].filter(Boolean).join(', ');
  const cacheKey = query.toLowerCase();
  const cachedResult = geocodeCache.get(cacheKey);

  if (geocodeCache.has(cacheKey)) {
    return cachedResult;
  }

  const result = await enqueueGeocodeRequest(query);
  geocodeCache.set(cacheKey, result);

  return result;
};

const enqueueGeocodeRequest = (query: string) => {
  const request = requestQueue.then(async () => {
    const elapsed = Date.now() - lastRequestAt;

    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed));
    }

    lastRequestAt = Date.now();
    return fetchNominatimResult(query);
  });

  requestQueue = request.then(
    () => undefined,
    () => undefined,
  );

  return request;
};

const fetchNominatimResult = async (query: string): Promise<GeocodedPlace | null> => {
  try {
    const url = new URL(NOMINATIM_SEARCH_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');

    if (process.env.NOMINATIM_EMAIL) {
      url.searchParams.set('email', process.env.NOMINATIM_EMAIL);
    }

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': NOMINATIM_USER_AGENT,
      },
    });

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as NominatimSearchResult[];
    const firstResult = results[0];

    if (!firstResult) {
      return null;
    }

    const latitude = Number(firstResult.lat);
    const longitude = Number(firstResult.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch {
    return null;
  }
};
