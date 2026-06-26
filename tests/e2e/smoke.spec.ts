import { expect, test } from '@playwright/test';
import { Visibility } from '../../generated/prisma';
import { cleanupTestData, createTestTrip, createTestUser, signInAs } from './helpers';

test.beforeEach(async () => {
  await cleanupTestData();
});

test.afterAll(async () => {
  await cleanupTestData();
});

test('landing page renders MVP copy', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Trip Scribe' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open trip workspace' })).toBeVisible();
  await expect(page.getByText('Everything needed to get from idea to shared trip')).toBeVisible();
});

test('sign-in page renders auth options', async ({ page }) => {
  await page.goto('/auth/signin');

  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
});

test('protected dashboard redirects anonymous users to sign-in', async ({ page }) => {
  await page.goto('/trips');

  await expect(page).toHaveURL(/\/auth\/signin/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('owner trip detail renders planning sections', async ({ browser }) => {
  const owner = await createTestUser('owner-smoke');
  const trip = await createTestTrip({ userId: owner.id, slug: `test-owner-smoke-${Date.now()}` });
  const context = await signInAs(browser, owner.email);
  const page = await context.newPage();

  await page.goto(`/trips/${trip.slug}`);

  await expect(page.getByRole('heading', { name: trip.title })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Itinerary' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Places' })).toBeVisible();

  await context.close();
});

test('public trip page renders read-only content', async ({ page }) => {
  const owner = await createTestUser('owner-public-smoke');
  const trip = await createTestTrip({
    userId: owner.id,
    visibility: Visibility.PUBLIC,
    slug: `test-public-smoke-${Date.now()}`,
  });

  await page.goto(`/share/${trip.slug}`);

  await expect(page.getByRole('heading', { name: trip.title })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Itinerary' })).toBeVisible();
  await expect(page.getByRole('button', { name: /delete/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /save/i })).toHaveCount(0);
});
