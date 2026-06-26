import { PrismaPg } from '@prisma/adapter-pg';
import { expect, request, test, type APIRequestContext, type Browser } from '@playwright/test';
import { config } from 'dotenv';
import { PrismaClient, Role, Visibility } from '../../generated/prisma';

config({ path: '.env', quiet: true });
config({ path: '.env.development.local', quiet: true });

const databaseUrl = process.env.E2E_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('E2E_DATABASE_URL is required for Playwright tests. Use a disposable test database.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
export const prisma = new PrismaClient({ adapter });

export const uniqueId = () => `${test.info().workerIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createTestUser = async (label: string) => {
  const id = uniqueId();

  return prisma.user.create({
    data: {
      email: `${label}-${id}@example.com`,
      name: `${label} Traveler`,
      role: Role.USER,
    },
  });
};

export const createTestTrip = async ({
  userId,
  visibility = Visibility.PRIVATE,
  slug = `test-trip-${uniqueId()}`,
}: {
  userId: string;
  visibility?: Visibility;
  slug?: string;
}) => {
  return prisma.trip.create({
    data: {
      title: `Test Trip ${uniqueId()}`,
      description: 'A Playwright test trip.',
      destinations: ['Lisbon', 'Porto'],
      slug,
      userId,
      visibility,
      startDate: new Date('2030-06-01T00:00:00.000Z'),
      endDate: new Date('2030-06-08T00:00:00.000Z'),
    },
  });
};

export const cleanupTestData = async () => {
  await prisma.trip.deleteMany({
    where: {
      OR: [{ slug: { startsWith: 'test-' } }, { title: { startsWith: 'Test ' } }],
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: { contains: '@example.com' },
    },
  });
};

export const signInAs = async (browser: Browser, email: string) => {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100';
  const authRequest = await request.newContext({ baseURL });
  const csrfResponse = await authRequest.get('/api/auth/csrf');
  expect(csrfResponse.ok()).toBe(true);

  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };
  const signInResponse = await authRequest.post('/api/auth/callback/e2e', {
    form: {
      csrfToken,
      email,
      json: 'true',
      callbackUrl: '/trips',
    },
  });
  expect(signInResponse.ok()).toBe(true);

  const storageState = await authRequest.storageState();
  await authRequest.dispose();

  return browser.newContext({ baseURL, storageState });
};

export const expectForbiddenMutation = async (api: APIRequestContext, url: string, body: unknown) => {
  const response = await api.patch(url, { data: body });
  expect(response.status()).toBe(404);
};
