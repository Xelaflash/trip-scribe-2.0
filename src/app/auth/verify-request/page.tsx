import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Check your email | Trip Scribe',
};

const VerifyRequest = () => {
  return (
    <div className="mx-auto flex w-full max-w-md items-center px-viewportPadding py-20">
      <div className="w-full rounded-3xl border border-border bg-card text-card-foreground shadow-elevationLow">
        <div className="p-6 sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-xs">
            <MailCheck className="size-7" aria-hidden="true" />
          </div>
          <p className="mt-6 text-xs font-extrabold tracking-[0.12em] text-secondary uppercase">Magic link sent</p>
          <h1 className="mt-2 text-3xl font-bold text-card-foreground">Check your email</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Open the sign-in link we sent to your inbox. You can close this tab after the message arrives.
          </p>
          <div className="mt-8 grid gap-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Back to sign in</Link>
            </Button>
            <p className="text-center text-xs leading-5 text-muted-foreground">
              If it does not show up, check spam or request a fresh link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyRequest;
