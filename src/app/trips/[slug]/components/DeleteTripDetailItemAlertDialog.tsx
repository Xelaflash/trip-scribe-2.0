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
  onDelete: () => Promise<void>;
}

export const DeleteTripDetailItemAlertDialog = ({
  itemName,
  title,
  description,
  icon,
  confirmLabel,
  onDelete,
}: DeleteTripDetailItemAlertDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

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
        <div className="border-b border-border/70 bg-surface/60 p-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            {icon}
          </div>
          <AlertDialogHeader className="mt-4">
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
