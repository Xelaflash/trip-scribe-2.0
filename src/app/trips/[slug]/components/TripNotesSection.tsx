import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { NoteForm } from '@/app/trips/[slug]/schema/tripDetailFormSchemas';
import type { TripPlaceholderSet } from '@/app/trips/[slug]/data/placeholders';
import type { TripWithDetails } from '@/queries/tripQueries';
import { createNote, deleteNote } from '@/queries/tripQueries';
import { NotebookPen, Plus, Trash2 } from 'lucide-react';

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
  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="m-0 flex items-center gap-2 text-xl font-semibold">
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
        {trip.notes.map((note) => (
          <div key={note.id} className="rounded-md border p-3">
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="m-0 text-base font-semibold">{note.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
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
    </article>
  );
};
