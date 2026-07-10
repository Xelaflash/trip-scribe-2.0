'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MAPBOX_SEARCH_THEME } from '@/app/trips/components/mapboxSearchTheme';

interface MapboxSearchFeatureSubset {
  geometry?: {
    coordinates?: number[];
  };
  properties?: {
    name?: string;
    mapbox_id?: string;
    feature_type?: string;
    address?: string;
    full_address?: string;
    place_formatted?: string;
    poi_category?: string[];
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
}

interface MapboxSearchRetrieveSubset {
  features?: MapboxSearchFeatureSubset[];
}

export interface SelectedPlaceSearchResult {
  address: string;
  label: string;
  name: string | null;
  category: string | null;
  mapboxId: string | null;
  featureType: string | null;
  latitude: number;
  longitude: number;
}

type PlaceSearchMode = 'place' | 'area';

interface PlaceSearchFieldProps {
  mode?: PlaceSearchMode;
  value: string;
  placeholder: string;
  onManualChange: (value: string) => void;
  onSelect: (place: SelectedPlaceSearchResult) => void;
  onBlur?: () => void;
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const SearchBox = dynamic(() => import('@mapbox/search-js-react').then((module) => module.SearchBox), { ssr: false });

export const PlaceSearchField = ({
  mode = 'place',
  value,
  placeholder,
  onManualChange,
  onSelect,
  onBlur,
}: PlaceSearchFieldProps) => {
  const selectedValuesRef = useRef<Set<string>>(new Set());

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <Input
        className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onManualChange(event.target.value)}
        onBlur={onBlur}
      />
    );
  }

  return (
    <div className="mapbox-search-control">
      <SearchBox
        accessToken={MAPBOX_ACCESS_TOKEN}
        value={value}
        onChange={(nextValue) => {
          if (selectedValuesRef.current.has(nextValue)) {
            return;
          }

          selectedValuesRef.current = new Set();
          onManualChange(nextValue);
        }}
        onRetrieve={(result) => {
          const selectedPlace = selectedPlaceFromRetrieveResult(result, mode);

          if (!selectedPlace) {
            return;
          }

          selectedValuesRef.current = selectedPlaceValues(selectedPlace);
          onSelect(selectedPlace);
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        options={{
          language: 'en',
          limit: 5,
          types: searchTypesByMode[mode],
        }}
        interceptSearch={(nextValue) => {
          const trimmedValue = nextValue.trim();
          return trimmedValue.length >= 3 ? trimmedValue : '';
        }}
        theme={MAPBOX_SEARCH_THEME}
        popoverOptions={{ placement: 'bottom-start', flip: true }}
      />
    </div>
  );
};

const searchTypesByMode = {
  area: 'neighborhood,locality,place',
  place: 'address,poi,place,locality,neighborhood,street',
} satisfies Record<PlaceSearchMode, string>;

const selectedPlaceValues = (place: SelectedPlaceSearchResult) => {
  return new Set([place.address, place.label, place.name].filter((value): value is string => Boolean(value)));
};

const selectedPlaceFromRetrieveResult = (result: unknown, mode: PlaceSearchMode): SelectedPlaceSearchResult | null => {
  const retrieveResult = result as MapboxSearchRetrieveSubset;
  const feature = retrieveResult.features?.[0];
  const longitude = feature?.properties?.coordinates?.longitude ?? feature?.geometry?.coordinates?.[0];
  const latitude = feature?.properties?.coordinates?.latitude ?? feature?.geometry?.coordinates?.[1];

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  const properties = feature?.properties;
  const address =
    properties?.full_address || [properties?.address, properties?.place_formatted].filter(Boolean).join(', ');
  const label = mode === 'area' ? areaLabelFromFeature(feature) : properties?.name || address;

  if (!address || !label) {
    return null;
  }

  return {
    address,
    label,
    name: properties?.name || null,
    category: properties?.poi_category?.[0] || null,
    mapboxId: properties?.mapbox_id || null,
    featureType: properties?.feature_type || null,
    latitude,
    longitude,
  };
};

const areaLabelFromFeature = (feature: MapboxSearchFeatureSubset | undefined) => {
  const properties = feature?.properties;
  const name = properties?.name?.trim();
  const formattedPlace = properties?.place_formatted?.trim();

  if (!name) {
    return formattedPlace || '';
  }

  return [name, formattedPlace].filter(Boolean).join(', ');
};
