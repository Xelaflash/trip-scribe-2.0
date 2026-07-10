'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { Map as MapboxMap, Marker, Popup } from 'mapbox-gl';
import { cn } from '@/lib/utils';

const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface TripPlacesMapPlace {
  id: string;
  name: string;
  category: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface TripPlacesMapProps {
  places: TripPlacesMapPlace[];
  className?: string;
}

export const TripPlacesMap = ({ places, className }: TripPlacesMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const mapboxglRef = useRef<typeof mapboxgl | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);

  const pinnedPlaces = useMemo(
    () =>
      places.flatMap((place) => {
        if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number') {
          return [];
        }

        return [{ ...place, latitude: place.latitude, longitude: place.longitude }];
      }),
    [places],
  );

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      if (!containerRef.current || mapRef.current) {
        return;
      }

      if (!MAPBOX_ACCESS_TOKEN) {
        setHasMapError(true);
        return;
      }

      try {
        const mapboxglModule = await import('mapbox-gl');
        const mapbox = mapboxglModule.default;

        if (!isMounted || !containerRef.current) {
          return;
        }

        mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
        mapboxglRef.current = mapbox;

        const map = new mapbox.Map({
          container: containerRef.current,
          style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || DEFAULT_MAP_STYLE,
          center: [0, 20],
          zoom: 1.25,
        });

        map.addControl(new mapbox.NavigationControl({ showCompass: false }), 'top-right');
        map.on('load', () => {
          if (isMounted) {
            setIsReady(true);
          }
        });
        map.on('error', () => {
          if (isMounted) {
            setHasMapError(true);
          }
        });

        mapRef.current = map;
      } catch {
        if (isMounted) {
          setHasMapError(true);
        }
      }
    };

    void initializeMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      mapboxglRef.current = null;
    };
  }, []);

  // Mapbox markers are imperative DOM objects, so this effect keeps them in sync with React data.
  /* eslint-disable react-you-might-not-need-an-effect/no-event-handler */
  useEffect(() => {
    const map = mapRef.current;
    const mapbox = mapboxglRef.current;

    if (!isReady || !map || !mapbox) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = pinnedPlaces.map((place) => {
      const markerElement = document.createElement('button');
      markerElement.type = 'button';
      markerElement.className = 'trip-map-marker';
      markerElement.setAttribute('aria-label', `Show ${place.name} on map`);

      const popup: Popup = new mapbox.Popup({ offset: 18, closeButton: false }).setHTML(
        `<strong>${escapeHtml(place.name)}</strong>${
          place.address ? `<span>${escapeHtml(place.address)}</span>` : ''
        }${place.category ? `<em>${escapeHtml(place.category)}</em>` : ''}`,
      );

      return new mapbox.Marker({ element: markerElement, anchor: 'bottom' })
        .setLngLat([place.longitude, place.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    if (pinnedPlaces.length > 1) {
      const bounds = new mapbox.LngLatBounds();
      pinnedPlaces.forEach((place) => bounds.extend([place.longitude, place.latitude]));
      map.fitBounds(bounds, { padding: 64, maxZoom: 14, duration: 600 });
    } else if (pinnedPlaces[0]) {
      map.easeTo({
        center: [pinnedPlaces[0].longitude, pinnedPlaces[0].latitude],
        zoom: Math.max(map.getZoom(), 11),
        duration: 600,
      });
    }
  }, [isReady, pinnedPlaces]);
  /* eslint-enable react-you-might-not-need-an-effect/no-event-handler */

  const emptyMessage = 'Add an address to a saved place to generate a map pin.';

  return (
    <div
      className={cn(
        'relative min-h-64 overflow-hidden rounded-3xl border border-border/70 bg-mint-100/40 shadow-xs dark:bg-emerald-950/60',
        className,
      )}
    >
      <div ref={containerRef} className="absolute inset-0" aria-label="Saved places map" />
      {(!isReady || pinnedPlaces.length === 0 || hasMapError) && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),hsl(160_64%_54%/0.14)),repeating-linear-gradient(45deg,transparent_0_16px,hsl(var(--primary)/0.06)_16px_17px)] p-6 text-center">
          <div className="max-w-64 rounded-3xl border border-border/70 bg-card/85 p-4 shadow-elevationLow backdrop-blur-md">
            <p className="text-sm font-black text-card-foreground">
              {hasMapError ? 'Map tiles could not load.' : emptyMessage}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {hasMapError
                ? 'Saved coordinates are still kept with each place. Check the Mapbox token and style settings.'
                : 'Pins appear after Trip Scribe finds coordinates for saved addresses.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const escapeHtml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};
