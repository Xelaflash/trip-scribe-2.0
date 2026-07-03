'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribeToMount = () => {
  return () => {};
};

const ThemeModeToggle = () => {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    () => true,
    () => false,
  );
  const { resolvedTheme, setTheme } = useTheme();

  const currentTheme = isMounted ? resolvedTheme : undefined;
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const Icon = nextTheme === 'dark' ? Moon : Sun;
  const label = nextTheme === 'dark' ? 'Switch to dark theme' : 'Switch to light theme';

  return (
    <button
      type="button"
      className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70 shadow-xs transition hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-ink-700"
      aria-label={label}
      disabled={!isMounted}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon className="size-4" aria-hidden="true" color="var(--color-foreground)" />
    </button>
  );
};

export default ThemeModeToggle;
