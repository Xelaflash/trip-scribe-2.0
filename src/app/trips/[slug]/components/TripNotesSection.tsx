'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, NotebookPen, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { noteSchema, type NoteForm, type NoteFormValues } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createNote, deleteNote, updateNote } from '@/queries/tripQueries';

export const TripNotesSection = ({
  form,
  placeholders,
  trip,
  onPlaceholderChange,
  onRefresh,
}: {
  form: NoteForm;
  placeholders: TripPlaceholderSet;
  trip: TripWithDetails;
  onPlaceholderChange: () => void;
  onRefresh: () => void;
}) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const editForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', content: '' },
  });

  const editingNote = trip.notes.find((note) => note.id === editingNoteId);

  const openEditDialog = (note: TripWithDetails['notes'][number]) => {
    editForm.reset({
      title: note.title,
      content: note.content,
    });
    setEditingNoteId(note.id);
  };

  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-elevationLow">
      <h2 className="m-0 flex items-center gap-2 text-xl font-bold text-primary-950">
        <NotebookPen className="size-5 text-primary" />
        Notes
      </h2>
      <Form {...form}>
        <form
          className="mt-4 grid gap-3"
          onSubmit={form.handleSubmit(async (values) => {
            await createNote(trip.slug, values);
            form.reset();
            onPlaceholderChange();
            onRefresh();
          })}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => <Input placeholder={placeholders.noteTitle} {...field} />}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => <Textarea placeholder={placeholders.noteContent} {...field} />}
          />
          <Button type="submit" size="sm">
            <Plus />
            Add note
          </Button>
        </form>
      </Form>
      <div className="mt-5 grid gap-3">
        {trip.notes.length === 0 ? (
          <p className="rounded-md border border-dashed border-border bg-muted p-4 text-sm text-muted-foreground">
            No notes yet.
          </p>
        ) : null}
        {trip.notes.map((note) => (
          <div key={note.id} className="rounded-md border border-border bg-white p-3">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="m-0 text-base font-bold text-primary-950">{note.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${note.title}`}
                onClick={() => openEditDialog(note)}
              >
                <Edit3 />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${note.title}`}
                onClick={async () => {
                  await deleteNote(trip.slug, note.id);
                  onRefresh();
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNoteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit note</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              className="grid gap-3"
              onSubmit={editForm.handleSubmit(async (values) => {
                if (!editingNote) {
                  return;
                }

                await updateNote(trip.slug, editingNote.id, values);
                setEditingNoteId(null);
                onRefresh();
              })}
            >
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => <Input placeholder={placeholders.noteTitle} {...field} />}
              />
              <FormField
                control={editForm.control}
                name="content"
                render={({ field }) => <Textarea placeholder={placeholders.noteContent} {...field} />}
              />
              <Button type="submit">Save note</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </article>
  );
};
