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
  const isSubmitDisabled = isSubmitting || !currentUser;

  const handleSubmit = async (values: z.infer<typeof newUserFormSchema>) => {
    const { name } = values;
    if (!currentUser) {
      return;
    }
    try {
      await updateUser(currentUser.id, { name });
      router.push('/trips');
    } catch (error) {
      form.setError('name', { message: error instanceof Error ? error.message : 'Could not update your profile.' });
    }
  };

  const handleNewUserSubmit = form.handleSubmit(handleSubmit);

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={handleNewUserSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className="h-12 rounded-full bg-background px-5 font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="gradient" size="pill" className="min-h-14 w-full" disabled={isSubmitDisabled}>
            {isSubmitting ? 'Saving...' : 'Start planning'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export { NewUserForm };
