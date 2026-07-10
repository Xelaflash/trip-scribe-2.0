import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock3, MailCheck, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Check your email | Trip Scribe',
};

const deliveryNotes = [
  {
    icon: Clock3,
    title: 'Give it a minute',
    description: 'Most links arrive quickly, but email delivery can occasionally take a short moment.',
  },
  {
    icon: ShieldCheck,
    title: 'Check spam or promotions',
    description: 'If it is not in your inbox, look for a message from Trip Scribe in filtered folders.',
  },
];

const VerifyRequest = () => {
  return (
    <section className="px-viewportPadding py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-outerContentWidth overflow-hidden rounded-4xl border border-border bg-card/95 text-card-foreground shadow-elevationMedium backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72 bg-emerald-950 sm:min-h-88 lg:min-h-150">
          <Image
            src="/pics/pexels-vlad-baranov-2161825204-38335924.jpg"
            alt="Sunlit rice terraces below a mountain"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--foreground)/0.03),hsl(var(--foreground)/0.58))]" />
          <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
            <p className="text-xs font-black tracking-[0.18em] text-mint-100 uppercase">Magic link sent</p>
            <p className="mt-2 max-w-md text-3xl leading-tight font-black sm:text-4xl">
              One tap and your trip workspace opens.
            </p>
          </div>
        </div>

        <div className="flex items-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-xl">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-primary/12 text-primary shadow-xs">
              <MailCheck className="size-8" aria-hidden="true" />
            </div>
            <p className="mt-7 text-xs font-black tracking-[0.18em] text-secondary uppercase">Check your email</p>
            <h1 className="mt-3 text-4xl leading-tight font-black text-card-foreground md:text-5xl">
              Your sign-in link is on the way.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Open the secure link we sent to your inbox to continue planning. You can leave this tab open while you
              check your email.
            </p>

            <div className="mt-8 grid gap-4">
              {deliveryNotes.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-card-foreground">{title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="gradient" size="pill" className="min-h-14">
                <Link href="/auth/signin">Request another link</Link>
              </Button>
              <Button asChild variant="quietOutline" size="pill" className="min-h-14">
                <Link href="/">
                  <ArrowLeft className="size-5" aria-hidden="true" />
                  Back home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyRequest;
