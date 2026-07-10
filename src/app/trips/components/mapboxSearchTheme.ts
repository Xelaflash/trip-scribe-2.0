export const MAPBOX_SEARCH_THEME = {
  variables: {
    unit: '1rem',
    minWidth: 'min(24rem, calc(100vw - 2rem))',
    spacing: '0.5rem',
    padding: '0.5rem 0.75rem',
    paddingFooterLabel: '0.5rem 0.75rem',
    colorText: 'hsl(var(--foreground))',
    colorPrimary: 'hsl(var(--primary))',
    colorSecondary: 'hsl(var(--muted-foreground))',
    colorBackground: 'hsl(var(--card))',
    colorBackgroundHover: 'hsl(var(--muted))',
    colorBackgroundActive: 'hsl(var(--surface-strong))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '16px',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    lineHeight: '1.5rem',
    fontFamily: 'var(--font-main), ui-sans-serif, system-ui, sans-serif',
    fontWeight: '600',
    fontWeightSemibold: '800',
    fontWeightBold: '900',
  },
  cssText: `
    .Geocoder,
    .SearchBox {
      align-items: center;
      background-color: hsl(var(--card));
      border: 1px solid hsl(var(--input));
      border-radius: 16px;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      display: flex;
      height: 3rem;
      padding: 0;
      transition: border-color 180ms ease, box-shadow 180ms ease;
    }

    .Geocoder:focus-within,
    .SearchBox:focus-within {
      border-color: hsl(var(--ring));
      box-shadow: 0 0 0 3px hsl(var(--ring) / 0.5);
    }

    .Input {
      color: hsl(var(--foreground));
      font-family: var(--font-main), ui-sans-serif, system-ui, sans-serif;
      font-size: 1rem;
      font-weight: 400;
      height: 100%;
      min-width: 0;
      overflow: hidden;
      padding: 0.25rem 2.5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      font-weight: 600;
    }

    @media (min-width: 48rem) {
      .Input {
        font-size: 0.875rem;
      }
    }

    .Input::placeholder {
      color: hsl(var(--muted-foreground));
      opacity: 1;

    }

    .Input:focus {
      border: 0;
      box-shadow: none;
      outline: 0;
    }

    .SearchIcon {
      color: hsl(var(--muted-foreground));
      fill: currentColor;
      left: 0.75rem;
    }

    .ActionIcon {
      color: hsl(var(--muted-foreground));
      right: 0.75rem;
    }

    .Results {
      background-color: hsl(var(--popover));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      margin-top: 0.25rem;
      overflow: hidden;
      border: 1px solid hsl(var(--surface));
    }

    .Suggestion {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-bottom: 1px solid hsl(var(--surface));
    }

    .Suggestion[aria-selected='true'] {
      background-color: hsl(var(--muted));
    }

    .SuggestionName {
      font-weight: 700;
    }
  `,
};
