'use client';

import { MapPin, Plus, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MAPBOX_SEARCH_THEME } from '@/app/trips/components/mapboxSearchTheme';
import type { SelectedDestinationInput } from '@/lib/tripValidation';
import { cn } from '@/lib/utils';

interface MapboxGeocodingFeatureSubset {
  geometry?: {
    coordinates?: number[];
  };
  properties?: {
    name?: string;
    mapbox_id?: string;
    feature_type?: string;
    place_formatted?: string;
    context?: {
      country?: { name?: string };
      region?: { name?: string };
      place?: { name?: string };
    };
  };
}

interface DestinationPickerProps {
  value: SelectedDestinationInput[];
  onChange: (destinations: SelectedDestinationInput[]) => void;
  onBlur?: () => void;
  placeholder: string;
  className?: string;
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const Geocoder = dynamic(() => import('@mapbox/search-js-react').then((module) => module.Geocoder), { ssr: false });

export const DestinationPicker = ({ value, onChange, onBlur, placeholder, className }: DestinationPickerProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [manualValue, setManualValue] = useState('');

  const addDestination = (destination: SelectedDestinationInput) => {
    const normalizedLabel = destination.label.trim();

    if (!normalizedLabel) {
      return;
    }

    const alreadySelected = value.some((selectedDestination) => {
      if (destination.mapboxId && selectedDestination.mapboxId) {
        return selectedDestination.mapboxId === destination.mapboxId;
      }

      return selectedDestination.label.toLowerCase() === normalizedLabel.toLowerCase();
    });

    if (alreadySelected) {
      return;
    }

    onChange([...value, { ...destination, label: normalizedLabel }]);
  };

  const removeDestination = (destination: SelectedDestinationInput) => {
    onChange(
      value.filter((selectedDestination) => {
        if (destination.mapboxId && selectedDestination.mapboxId) {
          return selectedDestination.mapboxId !== destination.mapboxId;
        }

        return selectedDestination.label !== destination.label;
      }),
    );
  };

  const handleRetrieve = (feature: unknown) => {
    const destination = selectedDestinationFromFeature(feature);

    if (!destination) {
      return;
    }

    addDestination(destination);
    setSearchValue('');
  };

  const handleManualAdd = () => {
    addDestination({ label: manualValue });
    setManualValue('');
  };

  return (
    <div className={cn('grid gap-3', className)}>
      {MAPBOX_ACCESS_TOKEN ? (
        <div className="mapbox-search-control">
          <Geocoder
            accessToken={MAPBOX_ACCESS_TOKEN}
            value={searchValue}
            onChange={setSearchValue}
            onRetrieve={handleRetrieve}
            onBlur={onBlur}
            placeholder={placeholder}
            options={{
              language: 'en',
              limit: 5,
              permanent: true,
              types: 'place,region,country',
            }}
            interceptSearch={(nextValue) => {
              const trimmedValue = nextValue.trim();
              return trimmedValue.length >= 3 ? trimmedValue : '';
            }}
            theme={MAPBOX_SEARCH_THEME}
            popoverOptions={{ placement: 'bottom-start', flip: true }}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-semibold shadow-xs"
            value={manualValue}
            onChange={(event) => setManualValue(event.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
          />
          <Button type="button" variant="secondary" size="icon" aria-label="Add destination" onClick={handleManualAdd}>
            <Plus />
          </Button>
        </div>
      )}
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((destination) => (
            <span
              key={destination.mapboxId || destination.label}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/80 bg-muted px-3 py-1.5 text-sm font-black text-foreground"
            >
              <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{destination.label}</span>
              <button
                type="button"
                className="grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-background hover:text-foreground"
                aria-label={`Remove ${destination.label}`}
                onClick={() => removeDestination(destination)}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const selectedDestinationFromFeature = (feature: unknown): SelectedDestinationInput | null => {
  const mapboxFeature = feature as MapboxGeocodingFeatureSubset;
  const name = mapboxFeature.properties?.name?.trim();

  if (!name) {
    return null;
  }

  const label = formatDestinationLabel(mapboxFeature);
  const [longitude, latitude] = mapboxFeature.geometry?.coordinates ?? [];

  return {
    label,
    mapboxId: mapboxFeature.properties?.mapbox_id,
    featureType: mapboxFeature.properties?.feature_type,
    latitude: typeof latitude === 'number' && Number.isFinite(latitude) ? latitude : null,
    longitude: typeof longitude === 'number' && Number.isFinite(longitude) ? longitude : null,
  };
};

const formatDestinationLabel = (feature: MapboxGeocodingFeatureSubset) => {
  const name = feature.properties?.name?.trim();
  const featureType = feature.properties?.feature_type;
  const context = feature.properties?.context;
  const country = context?.country?.name;
  const region = context?.region?.name;

  if (!name) {
    return '';
  }

  if (featureType === 'country') {
    return name;
  }

  if (featureType === 'region') {
    return uniqueParts([name, country]).join(', ');
  }

  return uniqueParts([name, region, country]).join(', ');
};

const uniqueParts = (parts: Array<string | null | undefined>) => {
  const seenParts = new Set<string>();

  return parts.flatMap((part) => {
    const trimmedPart = part?.trim();

    if (!trimmedPart) {
      return [];
    }

    const key = trimmedPart.toLowerCase();

    if (seenParts.has(key)) {
      return [];
    }

    seenParts.add(key);
    return [trimmedPart];
  });
};
