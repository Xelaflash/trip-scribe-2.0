'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// UI
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Hooks & types
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { User } from '@prisma/generated';
import { updateUser } from '@/queries/userQueries';

const newUserFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

const NewUserForm = () => {
  const currentUser = useCurrentUser() as User;
  const router = useRouter();

  const form = useForm<z.infer<typeof newUserFormSchema>>({
    resolver: zodResolver(newUserFormSchema),
    defaultValues: {
      name: '',
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof newUserFormSchema>) => {
    const { name } = values;
    if (!currentUser) {
      return;
    }
    try {
      await updateUser(currentUser.id, { name }).then(() => router.push('/trips'));
    } catch (error) {
      form.setError('name', { message: error instanceof Error ? error.message : 'Could not update your profile.' });
    }
  };

  return (
    <>
      <h3>Please Enter your name</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jon doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </>
  );
};

export { NewUserForm };
