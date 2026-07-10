'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
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
  destination: string | null;
  className?: string;
}

export const TripPlacesMap = ({ destination, className }: TripPlacesMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null);
  const trimmedDestination = destination?.trim() || null;

  useEffect(() => {
    let isMounted = true;
    let hasLoaded = false;
    let resizeObserver: ResizeObserver | null = null;

    const initializeMap = async () => {
      const containerElement = containerRef.current;

      if (!containerElement || mapRef.current) {
        return;
      }

      if (!MAPBOX_ACCESS_TOKEN) {
        setMapErrorMessage('Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN and restart the dev server.');
        return;
      }

      setIsReady(false);
      setMapErrorMessage(null);

      try {
        const mapboxglModule = await import('mapbox-gl');
        const mapbox = mapboxglModule.default;

        if (!isMounted) {
          return;
        }

        mapbox.accessToken = MAPBOX_ACCESS_TOKEN;

        if (!mapbox.supported()) {
          setMapErrorMessage('Mapbox GL is not supported by this browser or graphics environment.');
          return;
        }

        const map = new mapbox.Map({
          accessToken: MAPBOX_ACCESS_TOKEN,
          container: containerElement,
          style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || DEFAULT_MAP_STYLE,
          center: [0, 20],
          zoom: 1.25,
        });

        map.addControl(new mapbox.NavigationControl({ showCompass: false }), 'top-right');
        map.on('load', () => {
          if (isMounted) {
            hasLoaded = true;
            window.requestAnimationFrame(() => {
              if (isMounted) {
                map.resize();
              }
            });
            setMapErrorMessage(null);
            setIsReady(true);
          }
        });
        map.on('error', (event) => {
          if (isMounted && !hasLoaded) {
            setMapErrorMessage(errorMessageFromMapboxEvent(event) ?? 'Map tiles could not load.');
          }
        });

        mapRef.current = map;
        window.requestAnimationFrame(() => {
          if (isMounted) {
            map.resize();
          }
        });
        resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(containerElement);
      } catch (error) {
        if (isMounted) {
          setMapErrorMessage(error instanceof Error ? error.message : 'Map could not initialize.');
        }
      }
    };

    void initializeMap();

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !trimmedDestination || !mapRef.current || !MAPBOX_ACCESS_TOKEN) {
      return;
    }

    let isCancelled = false;

    const centerMapOnDestination = async () => {
      const center = await geocodeDestinationCenter(trimmedDestination);

      if (isCancelled || !center || !mapRef.current) {
        return;
      }

      mapRef.current.easeTo({
        center,
        zoom: 4,
        duration: 600,
      });
    };

    void centerMapOnDestination();

    return () => {
      isCancelled = true;
    };
  }, [trimmedDestination, isReady]);

  const isLoading = !isReady && !mapErrorMessage;

  return (
    <div
      className={cn(
        'relative h-72 min-h-72 overflow-hidden rounded-3xl border border-border/70 bg-mint-100/40 shadow-xs dark:bg-emerald-950/60',
        className,
      )}
    >
      <div ref={containerRef} className="absolute inset-0 size-full" aria-label="Saved places map" />
      {(isLoading || mapErrorMessage) && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),hsl(160_64%_54%/0.14)),repeating-linear-gradient(45deg,transparent_0_16px,hsl(var(--primary)/0.06)_16px_17px)] p-6 text-center">
          <div className="max-w-64 rounded-3xl border border-border/70 bg-card/85 p-4 shadow-elevationLow backdrop-blur-md">
            <p className="text-sm font-black text-card-foreground">
              {mapErrorMessage ? 'Map could not load.' : 'Loading map...'}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {mapErrorMessage ? mapErrorMessage : 'The base map will appear before any place pins are added.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const errorMessageFromMapboxEvent = (event: unknown) => {
  if (!event || typeof event !== 'object' || !('error' in event)) {
    return null;
  }

  const { error } = event as { error?: unknown };

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const { message } = error as { message?: unknown };

    if (typeof message === 'string') {
      return message;
    }
  }

  return null;
};

const geocodeDestinationCenter = async (destination: string): Promise<[number, number] | null> => {
  try {
    const params = new URLSearchParams({
      q: destination,
      types: 'place,region,country',
      limit: '1',
      access_token: MAPBOX_ACCESS_TOKEN ?? '',
    });
    const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      features?: Array<{
        geometry?: {
          coordinates?: [number, number];
        };
      }>;
    };

    return data.features?.[0]?.geometry?.coordinates ?? null;
  } catch {
    return null;
  }
};
