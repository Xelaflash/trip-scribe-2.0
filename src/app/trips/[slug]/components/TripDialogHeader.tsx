'use client';

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TripDialogHeaderProps {
  backgroundImageSrc: string;
  description: string;
  emoji: string;
  eyebrow: string;
  title: string;
}

export const TripDialogHeader = ({ backgroundImageSrc, description, emoji, eyebrow, title }: TripDialogHeaderProps) => (
  <DialogHeader className="relative overflow-hidden border-b border-border/70 bg-card p-6 pr-14 text-left md:px-8 md:pr-16">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--card)/0.94)_0%,hsl(var(--card)/0.86)_42%,hsl(var(--card)/0.50)_75%,hsl(var(--card)/0.20)_100%)]" />
    <div className="relative flex flex-col items-start gap-0">
      <div className="relative flex  items-center gap-4">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/60 bg-card/85 text-2xl shadow-xs backdrop-blur-sm sm:size-14 sm:text-3xl"
          aria-hidden="true"
        >
          {emoji}
        </span>
        <p className="flex w-fit items-center rounded-full border border-border/70 bg-card/85 px-3 py-1 text-xs font-black tracking-[0.16em] text-secondary uppercase shadow-xs backdrop-blur-sm">
          {eyebrow}
        </p>
      </div>
      <div className="min-w-0">
        <DialogTitle className="mt-3 text-2xl leading-tight font-black tracking-normal text-card-foreground sm:text-3xl">
          {title}
        </DialogTitle>
        <DialogDescription className="max-w-xl text-sm leading-6 text-foreground ">{description}</DialogDescription>
      </div>
    </div>
  </DialogHeader>
);
