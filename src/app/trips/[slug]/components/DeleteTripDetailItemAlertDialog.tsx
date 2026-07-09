'use client';

import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteTripDetailItemAlertDialogProps {
  itemName: string;
  title: string;
  description: ReactNode;
  icon: ReactNode;
  confirmLabel: string;
  decorationVariant: 'itinerary' | 'note' | 'place';
  onDelete: () => Promise<void>;
}

const decorationClasses = {
  itinerary: {
    icon: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    primary: '-top-8 -right-6 size-24 rotate-12 rounded-[2rem] bg-sky-400/20',
    secondary: 'right-16 -bottom-6 h-12 w-28 -rotate-6 rounded-full bg-mint-300/25',
    tertiary: 'top-6 right-6 size-5 rounded-full bg-primary/25',
  },
  note: {
    icon: 'bg-amber-400/15 text-amber-700 dark:text-amber-300',
    primary: '-top-9 -right-4 h-20 w-32 -rotate-12 rounded-[2.25rem] bg-amber-300/25',
    secondary: 'right-20 -bottom-7 size-[4.5rem] rounded-full bg-secondary/20',
    tertiary: 'top-7 right-8 h-4 w-10 rotate-12 rounded-full bg-rose-300/30',
  },
  place: {
    icon: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    primary: '-top-7 -right-8 size-[6.5rem] rounded-[45%_55%_60%_40%] bg-emerald-400/20',
    secondary: 'right-[4.5rem] -bottom-8 h-14 w-24 rotate-12 rounded-[2rem] bg-cyan-300/25',
    tertiary: 'top-8 right-7 size-6 rounded-full bg-lime-300/35',
  },
} as const;

export const DeleteTripDetailItemAlertDialog = ({
  itemName,
  title,
  description,
  icon,
  confirmLabel,
  decorationVariant,
  onDelete,
}: DeleteTripDetailItemAlertDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const decoration = decorationClasses[decorationVariant];

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${itemName}`}
          disabled={isDeleting}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden p-0">
        <div className="relative overflow-hidden border-b border-border/70 bg-surface/60 p-6">
          <span className={`absolute ${decoration.primary}`} aria-hidden="true" />
          <span className={`absolute ${decoration.secondary}`} aria-hidden="true" />
          <span className={`absolute ${decoration.tertiary}`} aria-hidden="true" />
          <div className={`relative flex size-14 items-center justify-center rounded-2xl ${decoration.icon}`}>
            {icon}
          </div>
          <AlertDialogHeader className="relative mt-4">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="p-6 pt-0">
          <AlertDialogCancel asChild>
            <Button variant="quietOutline" disabled={isDeleting}>
              Keep it
            </Button>
          </AlertDialogCancel>
          <Button variant="destructiveStable" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 aria-hidden="true" />
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
