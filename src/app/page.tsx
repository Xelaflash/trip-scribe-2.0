import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, NotebookPen, Share2 } from 'lucide-react';
import { SITE_TITLE } from '@/constants';
import { Button } from '@/components/ui/button';

const highlights = [
  {
    icon: CalendarDays,
    title: 'Plan the days',
    text: 'Shape each trip around dated itinerary items, destinations, and the stops that matter.',
  },
  {
    icon: NotebookPen,
    title: 'Keep useful notes',
    text: 'Store reminders, context, and travel notes beside the trip they belong to.',
  },
  {
    icon: MapPin,
    title: 'Save places',
    text: 'Track restaurants, landmarks, hotels, and links in one clean workspace.',
  },
  {
    icon: Share2,
    title: 'Share when ready',
    text: 'Publish a read-only trip page without exposing your private planning tools.',
  },
];

export default function Home() {
  return (
    <>
      <section className="-mt-headerHeight min-h-[72vh] bg-[linear-gradient(90deg,hsl(171deg_60%_12%/0.86),hsl(171deg_60%_12%/0.44)),url('/homeBg.jpg')] bg-cover bg-center">
        <div className="flex min-h-[72vh] items-center px-viewportPadding pt-[calc(var(--header-height)+3rem)] pb-12">
          <div className="w-full max-w-176 text-white">
            <p className="m-0 text-[0.78rem] font-extrabold tracking-[0.12em] text-secondary uppercase">
              Travel planning, written clearly
            </p>
            <h1 className="mt-2.5 mb-0 text-[3.3rem] leading-[0.92] text-white min-[861px]:text-[clamp(3rem,8vw,6.5rem)]">
              {SITE_TITLE}
            </h1>
            <p className="mt-5 max-w-xl text-xl text-white/90">
              A focused workspace for planning trips, collecting useful notes, and sharing a polished read-only
              itinerary.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/trips">Open trip workspace</Link>
              </Button>
              <Button asChild size="lg" variant="orange">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface px-viewportPadding py-16">
        <div className="mx-auto grid w-full max-w-280 gap-8">
          <div>
            <p className="m-0 text-[0.78rem] font-extrabold tracking-[0.12em] text-secondary uppercase">
              Built for the first useful version
            </p>
            <h2 className="mt-1.5 mb-0 max-w-2xl text-[clamp(2rem,4vw,3rem)] leading-none">
              Everything needed to get from idea to shared trip
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[861px]:grid-cols-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="min-h-56 rounded-lg border border-border bg-white p-5 shadow-(--shadow-elevation-low)"
                >
                  <Icon className="size-8 text-primary " />
                  <h3 className="mt-2 text-lg ">{item.title}</h3>
                  <p className="mt-2 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-280 grid-cols-1 items-center gap-12 px-viewportPadding py-16 min-[861px]:grid-cols-[0.9fr_1fr]">
        <div>
          <p className="m-0 text-[0.78rem] font-extrabold tracking-[0.12em] text-secondary uppercase">
            Simple workflow
          </p>
          <h2 className="mt-1.5 mb-0 max-w-2xl text-[clamp(2rem,4vw,3rem)] leading-none">Create, organize, publish</h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Start with the trip basics, add itinerary items as plans firm up, keep notes and places close by, then
            switch the trip to public when it is ready to share.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <Image
              src="/illusHome.svg"
              alt="Travelers reviewing a trip plan"
              width={520}
              height={520}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
}
