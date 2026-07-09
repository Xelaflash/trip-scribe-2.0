'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, NotebookPen, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TripDialogHeader } from '@/app/trips/[slug]/components/TripDialogHeader';
import { noteSchema, type NoteForm, type NoteFormValues } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createNote, deleteNote, updateNote } from '@/queries/tripQueries';

interface NoteFormFieldsProps {
  form: NoteForm;
  placeholders: TripPlaceholderSet;
}

const NoteFormFields = ({ form, placeholders }: NoteFormFieldsProps) => (
  <div className="grid gap-4">
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input
              className="h-12 rounded-2xl border-border/80 bg-card/80 px-4 font-black shadow-xs"
              placeholder={placeholders.noteTitle}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <Textarea
              className="min-h-36 rounded-2xl border-border/80 bg-card/80 px-4 py-3 font-medium shadow-xs"
              placeholder={placeholders.noteContent}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const editForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', content: '' },
  });

  const editingNote = trip.notes.find((note) => note.id === editingNoteId);
  const isCreating = form.formState.isSubmitting;
  const isUpdating = editForm.formState.isSubmitting;

  const openEditDialog = (note: TripWithDetails['notes'][number]) => {
    editForm.reset({
      title: note.title,
      content: note.content,
    });
    setEditingNoteId(note.id);
  };

  return (
    <article className="rounded-4xl border border-border/80 bg-card/85 p-6 shadow-elevationLow backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 flex items-center gap-2 text-2xl font-black tracking-normal text-card-foreground">
          <NotebookPen className="size-6 text-primary" />
          Notes
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="pill">
              <Plus />
              Add note
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
            <TripDialogHeader
              description="Save a reminder, idea, or practical detail for this trip."
              emoji="📝"
              eyebrow="Notes"
              title="Add note"
            />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  await createNote(trip.slug, values);
                  form.reset();
                  setIsCreateDialogOpen(false);
                  onPlaceholderChange();
                  onRefresh();
                })}
              >
                <div className="p-6">
                  <NoteFormFields form={form} placeholders={placeholders} />
                </div>
                <DialogFooter className="border-t border-border/70 bg-card/95 px-6 py-4">
                  <Button type="submit" variant="gradient" size="pill" disabled={isCreating}>
                    {isCreating ? 'Adding note...' : 'Add note'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4">
        {trip.notes.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-muted/70 p-5 text-sm font-semibold text-muted-foreground">
            No notes yet.
          </p>
        ) : null}
        {trip.notes.map((note) => (
          <article key={note.id} className="rounded-3xl border border-border/80 bg-background/70 p-5 shadow-xs">
            <div className="flex justify-between gap-4">
              <div className="min-w-0">
                <h3 className="m-0 text-xl font-black tracking-normal text-foreground">{note.title}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{note.content}</p>
              </div>
              <div className="flex shrink-0 gap-1">
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
                  className="text-muted-foreground hover:text-destructive"
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
          </article>
        ))}
      </div>

      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNoteId(null)}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <TripDialogHeader
            description="Update the saved context for this trip note."
            emoji="✍️"
            eyebrow="Notes"
            title="Edit note"
          />
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(async (values) => {
                if (!editingNote) {
                  return;
                }

                await updateNote(trip.slug, editingNote.id, values);
                setEditingNoteId(null);
                onRefresh();
              })}
            >
              <div className="p-6">
                <NoteFormFields form={editForm} placeholders={placeholders} />
              </div>
              <DialogFooter className="border-t border-border/70 bg-card/95 px-6 py-4">
                <Button type="submit" variant="gradient" size="pill" disabled={isUpdating}>
                  {isUpdating ? 'Saving note...' : 'Save note'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </article>
  );
};
