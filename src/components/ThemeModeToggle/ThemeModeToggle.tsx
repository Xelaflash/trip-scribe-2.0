'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Toggle } from '@/components/ui/toggle';

const themeModes = [
  { value: 'system', label: 'Use system theme', icon: Monitor },
  { value: 'light', label: 'Use light theme', icon: Sun },
  { value: 'dark', label: 'Use dark theme', icon: Moon },
] as const;

const ThemeModeToggle = () => {
  const { setTheme, theme = 'system' } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border bg-card/70 p-1 text-card-foreground shadow-xs"
      role="group"
      aria-label="Theme mode"
    >
      {themeModes.map((mode) => {
        const Icon = mode.icon;

        return (
          <Toggle
            key={mode.value}
            size="sm"
            aria-label={mode.label}
            pressed={theme === mode.value}
            onPressedChange={(isPressed) => {
              if (isPressed) {
                setTheme(mode.value);
              }
            }}
          >
            <Icon className="size-4" />
          </Toggle>
        );
      })}
    </div>
  );
};

export default ThemeModeToggle;
