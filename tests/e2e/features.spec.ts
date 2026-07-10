import { expect, test } from '@playwright/test';
import { Visibility } from '../../generated/prisma';
import { createTestTrip, createTestUser, expectForbiddenMutation, signInAs, uniqueId } from './helpers';

test('owner can create, update, and delete trips', async ({ browser }) => {
  const owner = await createTestUser('owner-trip-crud');
  const context = await signInAs(browser, owner.email);
  const api = context.request;

  const createResponse = await api.post('/api/trips', {
    data: {
      title: 'Test Alpine Route',
      description: 'Created from Playwright.',
      destinations: [
        {
          label: 'Chamonix, Auvergne-Rhone-Alpes, France',
          mapboxId: 'mapbox.place.test-chamonix',
          featureType: 'place',
          latitude: 45.9237,
          longitude: 6.8694,
        },
        {
          label: 'Annecy, Auvergne-Rhone-Alpes, France',
          mapboxId: 'mapbox.place.test-annecy',
          featureType: 'place',
          latitude: 45.8992,
          longitude: 6.1294,
        },
      ],
      visibility: 'PRIVATE',
      startDate: '2031-01-10T00:00:00.000Z',
      endDate: '2031-01-14T00:00:00.000Z',
    },
  });
  expect(createResponse.status()).toBe(201);
  const trip = (await createResponse.json()) as {
    slug: string;
    destinations: string[];
    tripDestinations: Array<{
      label: string;
      mapboxId: string | null;
      latitude: number | null;
      longitude: number | null;
    }>;
  };
  expect(trip.destinations).toEqual(['Chamonix, Auvergne-Rhone-Alpes, France', 'Annecy, Auvergne-Rhone-Alpes, France']);
  expect(trip.tripDestinations).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        label: 'Chamonix, Auvergne-Rhone-Alpes, France',
        mapboxId: 'mapbox.place.test-chamonix',
        latitude: 45.9237,
        longitude: 6.8694,
      }),
    ]),
  );

  const updateResponse = await api.patch(`/api/trips/${trip.slug}`, {
    data: {
      title: 'Test Alpine Route Updated',
      destinations: ['Zermatt, Switzerland'],
      visibility: 'PUBLIC',
    },
  });
  expect(updateResponse.ok()).toBe(true);
  const updatedTrip = (await updateResponse.json()) as {
    slug: string;
    title: string;
    visibility: string;
    destinations: string[];
    tripDestinations: Array<{ label: string; mapboxId: string | null }>;
  };
  expect(updatedTrip.title).toBe('Test Alpine Route Updated');
  expect(updatedTrip.visibility).toBe('PUBLIC');
  expect(updatedTrip.destinations).toEqual(['Zermatt, Switzerland']);
  expect(updatedTrip.tripDestinations).toEqual([
    expect.objectContaining({ label: 'Zermatt, Switzerland', mapboxId: null }),
  ]);

  const deleteResponse = await api.delete(`/api/trips/${updatedTrip.slug}`);
  expect(deleteResponse.status()).toBe(204);

  const getResponse = await api.get(`/api/trips/${updatedTrip.slug}`);
  expect(getResponse.status()).toBe(404);

  await context.close();
});

test('non-owner cannot mutate another user trip', async ({ browser }) => {
  const owner = await createTestUser('owner-protected');
  const nonOwner = await createTestUser('non-owner-protected');
  const trip = await createTestTrip({ userId: owner.id, slug: `test-protected-${uniqueId()}` });
  const context = await signInAs(browser, nonOwner.email);
  const api = context.request;

  await expectForbiddenMutation(api, `/api/trips/${trip.slug}`, { title: 'Test Stolen Trip' });

  const deleteResponse = await api.delete(`/api/trips/${trip.slug}`);
  expect(deleteResponse.status()).toBe(404);

  const itineraryResponse = await api.post(`/api/trips/${trip.slug}/itinerary`, {
    data: { title: 'Test Unauthorized Item', startsAt: null, endsAt: null, sortOrder: 0 },
  });
  expect(itineraryResponse.status()).toBe(404);

  await context.close();
});

test('itinerary, notes, and places support CRUD', async ({ browser }) => {
  const owner = await createTestUser('owner-items-crud');
  const trip = await createTestTrip({ userId: owner.id, slug: `test-items-${uniqueId()}` });
  const context = await signInAs(browser, owner.email);
  const api = context.request;

  const itineraryCreate = await api.post(`/api/trips/${trip.slug}/itinerary`, {
    data: {
      title: 'Test Lunch',
      description: 'Initial itinerary item.',
      location: 'Mercado',
      startsAt: '2030-06-02T12:00:00.000Z',
      endsAt: null,
      sortOrder: 0,
    },
  });
  expect(itineraryCreate.status()).toBe(201);
  const itinerary = (await itineraryCreate.json()) as { id: string };
  const itineraryUpdate = await api.patch(`/api/trips/${trip.slug}/itinerary/${itinerary.id}`, {
    data: { title: 'Test Long Lunch' },
  });
  expect(itineraryUpdate.ok()).toBe(true);
  const itineraryDelete = await api.delete(`/api/trips/${trip.slug}/itinerary/${itinerary.id}`);
  expect(itineraryDelete.status()).toBe(204);

  const noteCreate = await api.post(`/api/trips/${trip.slug}/notes`, {
    data: { title: 'Test Reminder', content: 'Bring passport.' },
  });
  expect(noteCreate.status()).toBe(201);
  const note = (await noteCreate.json()) as { id: string };
  const noteUpdate = await api.patch(`/api/trips/${trip.slug}/notes/${note.id}`, {
    data: { content: 'Bring passport and adapter.' },
  });
  expect(noteUpdate.ok()).toBe(true);
  const noteDelete = await api.delete(`/api/trips/${trip.slug}/notes/${note.id}`);
  expect(noteDelete.status()).toBe(204);

  const placeCreate = await api.post(`/api/trips/${trip.slug}/places`, {
    data: {
      name: 'Test Cafe',
      category: 'Cafe',
      address: '1201 S Main St, Ann Arbor, Michigan 48104, United States of America',
      mapboxId: 'mapbox.poi.test-cafe',
      featureType: 'poi',
      latitude: 42.2658,
      longitude: -83.7487,
      url: 'https://example.com',
      notes: 'Good breakfast.',
    },
  });
  expect(placeCreate.status()).toBe(201);
  const place = (await placeCreate.json()) as {
    id: string;
    address: string | null;
    mapboxId: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  expect(place.address).toBe('1201 S Main St, Ann Arbor, Michigan 48104, United States of America');
  expect(place.mapboxId).toBe('mapbox.poi.test-cafe');
  expect(place.latitude).toBe(42.2658);
  expect(place.longitude).toBe(-83.7487);
  const placeUpdate = await api.patch(`/api/trips/${trip.slug}/places/${place.id}`, {
    data: { notes: 'Good breakfast and coffee.' },
  });
  expect(placeUpdate.ok()).toBe(true);
  const placeClearAddress = await api.patch(`/api/trips/${trip.slug}/places/${place.id}`, {
    data: { address: '' },
  });
  expect(placeClearAddress.ok()).toBe(true);
  const placeWithoutPin = (await placeClearAddress.json()) as {
    address: string | null;
    mapboxId: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  expect(placeWithoutPin.address).toBeNull();
  expect(placeWithoutPin.mapboxId).toBeNull();
  expect(placeWithoutPin.latitude).toBeNull();
  expect(placeWithoutPin.longitude).toBeNull();
  const placeDelete = await api.delete(`/api/trips/${trip.slug}/places/${place.id}`);
  expect(placeDelete.status()).toBe(204);

  await context.close();
});

test('private share URL is inaccessible and public share URL is read-only', async ({ page }) => {
  const owner = await createTestUser('owner-share-access');
  const privateTrip = await createTestTrip({
    userId: owner.id,
    visibility: Visibility.PRIVATE,
    slug: `test-private-share-${uniqueId()}`,
  });
  const publicTrip = await createTestTrip({
    userId: owner.id,
    visibility: Visibility.PUBLIC,
    slug: `test-public-share-${uniqueId()}`,
  });

  const privateResponse = await page.request.get(`/share/${privateTrip.slug}`);
  expect(privateResponse.status()).toBe(404);

  await page.goto(`/share/${publicTrip.slug}`);
  await expect(page.getByRole('heading', { name: publicTrip.title })).toBeVisible();
  await expect(page.getByRole('button', { name: /delete/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /edit/i })).toHaveCount(0);
});
