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
  name: string | null;
  category: string | null;
  mapboxId: string | null;
  featureType: string | null;
  latitude: number;
  longitude: number;
}

interface PlaceSearchFieldProps {
  value: string;
  placeholder: string;
  onManualChange: (value: string) => void;
  onSelect: (place: SelectedPlaceSearchResult) => void;
  onBlur?: () => void;
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const SearchBox = dynamic(() => import('@mapbox/search-js-react').then((module) => module.SearchBox), { ssr: false });

export const PlaceSearchField = ({ value, placeholder, onManualChange, onSelect, onBlur }: PlaceSearchFieldProps) => {
  const selectedAddressRef = useRef<string | null>(null);

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
          if (selectedAddressRef.current === nextValue) {
            return;
          }

          onManualChange(nextValue);
        }}
        onRetrieve={(result) => {
          const selectedPlace = selectedPlaceFromRetrieveResult(result);

          if (!selectedPlace) {
            return;
          }

          selectedAddressRef.current = selectedPlace.address;
          onSelect(selectedPlace);
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        options={{
          language: 'en',
          limit: 5,
          types: 'address,poi,place,locality,neighborhood,street',
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

const selectedPlaceFromRetrieveResult = (result: unknown): SelectedPlaceSearchResult | null => {
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

  if (!address) {
    return null;
  }

  return {
    address,
    name: properties?.name || null,
    category: properties?.poi_category?.[0] || null,
    mapboxId: properties?.mapbox_id || null,
    featureType: properties?.feature_type || null,
    latitude,
    longitude,
  };
};
