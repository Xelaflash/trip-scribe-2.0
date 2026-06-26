import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cleanupTestData } from './helpers';

const POSTGRES_IMAGE = 'postgres:17-alpine';

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

const runPsqlQuiet = (databaseUrl: string, args: string[]) => {
  const url = new URL(databaseUrl);

  try {
    execFileSync('psql', args, {
      env: {
        ...process.env,
        PGPASSWORD: decodeURIComponent(url.password),
      },
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
};

const commandExists = (command: string) => {
  try {
    execFileSync('sh', ['-c', `command -v ${command}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const commandPath = (command: string) => {
  try {
    return execFileSync('sh', ['-c', `command -v ${command}`])
      .toString()
      .trim();
  } catch {
    return null;
  }
};

const postgresToolPath = (tool: 'initdb' | 'pg_ctl') => {
  const postgresPath = commandPath('postgres');

  if (postgresPath) {
    const siblingToolPath = join(dirname(postgresPath), tool);

    if (existsSync(siblingToolPath)) {
      return siblingToolPath;
    }
  }

  const pathTool = commandPath(tool);

  if (!pathTool) {
    throw new Error(
      `${tool} was not found. Start Docker or install PostgreSQL server tools, then rerun pnpm test:e2e.`,
    );
  }

  return pathTool;
};

const databaseNameFromUrl = (databaseUrl: string) => {
  const databaseName = new URL(databaseUrl).pathname.slice(1);

  if (!/^[A-Za-z0-9_-]+$/.test(databaseName)) {
    throw new Error('E2E_DATABASE_URL database name must only contain letters, numbers, underscores, or hyphens.');
  }

  return databaseName;
};

const maintenanceDatabaseUrl = (databaseUrl: string) => {
  const url = new URL(databaseUrl);
  url.pathname = '/postgres';
  return url.toString();
};

const connectionArgsFor = (databaseUrl: string) => {
  const url = new URL(databaseUrl);

  return [
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
};

const canConnect = (databaseUrl: string) => {
  return runPsqlQuiet(databaseUrl, [...connectionArgsFor(databaseUrl), '--command', 'SELECT 1;']);
};

const ensureLocalPostgres = (databaseUrl: string) => {
  const url = new URL(databaseUrl);

  if (!['localhost', '127.0.0.1', '::1'].includes(url.hostname)) {
    return;
  }

  const port = url.port || '5432';
  const containerName = `trip-scribe-e2e-postgres-${port}`;

  if (commandExists('docker')) {
    try {
      execFileSync('docker', ['start', containerName], { stdio: 'ignore' });
      waitForLocalPostgres(databaseUrl, containerName);
      return;
    } catch {
      try {
        execFileSync(
          'docker',
          [
            'run',
            '--detach',
            '--name',
            containerName,
            '--publish',
            `${port}:5432`,
            '--env',
            `POSTGRES_PASSWORD=${decodeURIComponent(url.password)}`,
            '--env',
            `POSTGRES_USER=${decodeURIComponent(url.username)}`,
            '--env',
            `POSTGRES_DB=${databaseNameFromUrl(databaseUrl)}`,
            POSTGRES_IMAGE,
          ],
          { stdio: 'inherit' },
        );
        waitForLocalPostgres(databaseUrl, containerName);
        return;
      } catch {
        // Fall through to a local pg_ctl cluster when Docker is unavailable or not running.
      }
    }
  }

  ensureLocalPgCtlPostgres(databaseUrl);
};

const waitForLocalPostgres = (databaseUrl: string, name: string) => {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (canConnect(maintenanceDatabaseUrl(databaseUrl))) {
      return;
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
  }

  throw new Error(`Timed out waiting for local E2E PostgreSQL ${name} to become ready.`);
};

const ensureLocalPgCtlPostgres = (databaseUrl: string) => {
  if (!commandExists('initdb') || !commandExists('pg_ctl')) {
    throw new Error(
      'No PostgreSQL server is listening on E2E_DATABASE_URL, Docker is unavailable, and initdb/pg_ctl were not found. Start PostgreSQL or Docker, then rerun pnpm test:e2e.',
    );
  }

  const url = new URL(databaseUrl);
  const port = url.port || '5432';
  const username = decodeURIComponent(url.username);
  const dataDir = join(process.cwd(), '.e2e-postgres', `postgres-${port}`);
  const initdbPath = postgresToolPath('initdb');
  const pgCtlPath = postgresToolPath('pg_ctl');

  if (!existsSync(join(dataDir, 'PG_VERSION'))) {
    mkdirSync(join(process.cwd(), '.e2e-postgres'), { recursive: true });
    execFileSync(initdbPath, ['--pgdata', dataDir, '--username', username, '--auth', 'trust'], { stdio: 'inherit' });
  }

  try {
    execFileSync(pgCtlPath, ['--pgdata', dataDir, '--options', `-p ${port} -h localhost`, '--wait', 'start'], {
      stdio: 'inherit',
    });
  } catch {
    if (!canConnect(maintenanceDatabaseUrl(databaseUrl))) {
      throw new Error(`Could not start local E2E PostgreSQL cluster at ${dataDir}.`);
    }
  }

  waitForLocalPostgres(databaseUrl, `pg_ctl cluster ${dataDir}`);
};

const ensureDatabase = (databaseUrl: string) => {
  if (canConnect(databaseUrl)) {
    return;
  }

  const databaseName = databaseNameFromUrl(databaseUrl);
  const maintenanceUrl = maintenanceDatabaseUrl(databaseUrl);
  const databaseExists = execFileSync('psql', [
    ...connectionArgsFor(maintenanceUrl),
    '--tuples-only',
    '--no-align',
    '--command',
    `SELECT 1 FROM pg_database WHERE datname = '${databaseName}';`,
  ])
    .toString()
    .trim();

  if (!databaseExists) {
    runPsql(maintenanceUrl, [...connectionArgsFor(maintenanceUrl), '--command', `CREATE DATABASE "${databaseName}";`]);
  }
};

const resetSchema = async (databaseUrl: string) => {
  const connectionArgs = connectionArgsFor(databaseUrl);

  runPsql(databaseUrl, [...connectionArgs, '--command', 'DROP SCHEMA IF EXISTS public CASCADE;']);
  runPsql(databaseUrl, [...connectionArgs, '--command', 'CREATE SCHEMA public;']);

  for (const migrationDir of readdirSync('prisma/migrations').sort()) {
    runPsql(databaseUrl, [...connectionArgs, '--file', join('prisma/migrations', migrationDir, 'migration.sql')]);
  }

  await cleanupTestData();
};

const globalSetup = async () => {
  const databaseUrl = process.env.E2E_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('E2E_DATABASE_URL is required for Playwright tests. Use a disposable test database.');
  }

  if (!canConnect(databaseUrl)) {
    ensureLocalPostgres(databaseUrl);
    ensureDatabase(databaseUrl);
  }

  await resetSchema(databaseUrl);
};

export default globalSetup;
