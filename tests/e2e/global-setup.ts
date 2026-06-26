import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { cleanupTestData } from './helpers';

const runPsql = (databaseUrl: string, args: string[]) => {
  const url = new URL(databaseUrl);

  execFileSync('psql', args, {
    env: {
      ...process.env,
      PGPASSWORD: decodeURIComponent(url.password),
    },
    stdio: 'inherit',
  });
};

const globalSetup = async () => {
  const databaseUrl = process.env.E2E_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('E2E_DATABASE_URL is required for Playwright tests. Use a disposable test database.');
  }

  const url = new URL(databaseUrl);
  const connectionArgs = [
    '--host',
    url.hostname,
    '--port',
    url.port || '5432',
    '--username',
    decodeURIComponent(url.username),
    '--dbname',
    url.pathname.slice(1),
    '--set',
    'ON_ERROR_STOP=1',
  ];

  runPsql(databaseUrl, [...connectionArgs, '--command', 'DROP SCHEMA IF EXISTS public CASCADE;']);
  runPsql(databaseUrl, [...connectionArgs, '--command', 'CREATE SCHEMA public;']);

  for (const migrationDir of readdirSync('prisma/migrations').sort()) {
    runPsql(databaseUrl, [...connectionArgs, '--file', join('prisma/migrations', migrationDir, 'migration.sql')]);
  }

  await cleanupTestData();
};

export default globalSetup;
