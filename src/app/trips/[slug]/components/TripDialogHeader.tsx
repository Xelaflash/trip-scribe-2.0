'use client';

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TripDialogHeaderProps {
  description: string;
  emoji: string;
  eyebrow: string;
  title: string;
}

export const TripDialogHeader = ({ description, emoji, eyebrow, title }: TripDialogHeaderProps) => (
  <DialogHeader className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(135deg,hsl(var(--surface))_0%,hsl(var(--card))_52%,hsl(var(--secondary)/0.18)_100%)] p-0 text-left">
    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,transparent_44%,hsl(var(--primary)/0.10)_44%,hsl(var(--primary)/0.10)_57%,transparent_57%)]" />
    <div className="relative flex gap-4 p-6 pr-14">
      <span
        className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/50 bg-card/85 text-2xl shadow-xs backdrop-blur"
        aria-hidden="true"
      >
        {emoji}
      </span>
      <div className="min-w-0">
        <p className="mb-2 w-fit rounded-full border border-border/70 bg-card/75 px-3 py-1 text-xs font-black text-muted-foreground shadow-xs">
          {eyebrow}
        </p>
        <DialogTitle className="text-2xl leading-tight font-black tracking-normal text-card-foreground">
          {title}
        </DialogTitle>
        <DialogDescription className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </DialogDescription>
      </div>
    </div>
  </DialogHeader>
);
