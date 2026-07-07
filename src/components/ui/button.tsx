import type * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm  transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-elevationLow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-elevationLow hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        destructiveStable:
          'border border-destructive bg-destructive text-destructive-foreground shadow-elevationLow hover:border-destructive hover:bg-destructive/85 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:hover:bg-destructive/70 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-border bg-card text-card-foreground shadow-xs hover:border-ring hover:bg-muted hover:text-foreground',
        quietOutline:
          'border border-border/70 bg-card text-card-foreground shadow-xs hover:border-border/70 hover:bg-surface hover:text-foreground',
        secondary: 'bg-surface-strong text-foreground shadow-xs hover:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'rounded-full bg-[linear-gradient(135deg,var(--button-primary-gradient-from),var(--button-primary-gradient-to))] text-[var(--button-primary-foreground)] shadow-[0_14px_30px_var(--button-primary-shadow)] hover:brightness-95',
        orangeGradient:
          'rounded-full bg-[linear-gradient(135deg,var(--button-orange-gradient-from),var(--button-orange-gradient-to))] text-[var(--button-orange-foreground)] shadow-elevationLow hover:brightness-95',
        orange:
          'bg-secondary text-secondary-foreground shadow-elevationLow hover:bg-secondary/90 focus-visible:ring-secondary/50',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 px-6 has-[>svg]:px-4',
        pill: 'h-auto px-6 py-3 text-base font-black',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};

export { Button, buttonVariants };
