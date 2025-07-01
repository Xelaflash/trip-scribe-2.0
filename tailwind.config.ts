import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-backdrop)',
          '50': 'hsl(157, 62%, 96%)',
          '100': 'hsl(155, 65%, 90%)',
          '200': 'hsl(157, 60%, 80%)',
          '300': 'hsl(161, 56%, 67%)',
          '400': 'hsl(163, 51%, 47%)',
          '500': 'hsl(166, 66%, 39%)',
          '600': 'hsl(166, 74%, 30%)',
          '700': 'hsl(168, 74%, 24%)',
          '800': 'hsl(168, 70%, 20%)',
          '900': 'hsl(169, 69%, 16%)',
          '950': 'hsl(171, 74%, 9%)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary))',
          foreground: 'var(--color-backdrop))',
          'orange-light': 'hsl(20, 89%, 65%)',
          'orange-dark': 'hsl(20, 89%, 45%)',
        },
        text: 'hsl(var(--color-text) / <alpha-value>)',
        backdrop: 'hsl(var(--color-backdrop) / <alpha-value>)',
        white: 'hsl(0, 0%, 97%)',
        transparent: 'transparent',
        tahiti: '#3ab7bf',
        bermuda: '#78dcca',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        contentWidth: 'var(--content-width)',
        outerContentWidth: 'var(--outer-content-width)',
        viewportPadding: 'var(--viewport-padding)',
        headerHeight: 'var(--header-height)',
        trimmedContentWidth: 'var(--trimmed-content-width)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
};

export default config;
