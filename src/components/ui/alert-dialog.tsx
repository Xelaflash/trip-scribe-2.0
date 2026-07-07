'use client';

import type * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';

const AlertDialog = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) => {
  return <DialogPrimitive.Root data-slot="alert-dialog" {...props} />;
};

const AlertDialogTrigger = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) => {
  return <DialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
};

const AlertDialogPortal = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) => {
  return <DialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
};

const AlertDialogCancel = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) => {
  return <DialogPrimitive.Close data-slot="alert-dialog-cancel" {...props} />;
};

const AlertDialogOverlay = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) => {
  return (
    <DialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-ink-950/60 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  );
};

const AlertDialogContent = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <DialogPrimitive.Content
        role="alertdialog"
        data-slot="alert-dialog-content"
        className={cn(
          'fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100svh-2rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-5 overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-elevationMedium duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-md',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
};

const AlertDialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
};

const AlertDialogFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
};

const AlertDialogTitle = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) => {
  return (
    <DialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-xl leading-tight font-black tracking-normal text-card-foreground', className)}
      {...props}
    />
  );
};

const AlertDialogDescription = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) => {
  return (
    <DialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      {...props}
    />
  );
};

export {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
