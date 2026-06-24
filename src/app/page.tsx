import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, NotebookPen, Share2 } from 'lucide-react';
import { SITE_TITLE } from '@/constants';
import { Button } from '@/components/ui/button';
import styles from './Home.module.css';

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
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>Travel planning, written clearly</p>
            <h1>{SITE_TITLE}</h1>
            <p className={styles.heroCopy}>
              A focused workspace for planning trips, collecting useful notes, and sharing a polished read-only
              itinerary.
            </p>
            <div className={styles.heroActions}>
              <Button asChild size="lg">
                <Link href="/trips">Open trip workspace</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.band}>
        <div className={styles.bandContent}>
          <div>
            <p className={styles.kicker}>Built for the first useful version</p>
            <h2>Everything needed to get from idea to shared trip</h2>
          </div>
          <div className={styles.featureGrid}>
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className={styles.feature}>
                  <Icon className={styles.featureIcon} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.workflow}>
        <div className={styles.workflowText}>
          <p className={styles.kicker}>Simple workflow</p>
          <h2>Create, organize, publish</h2>
          <p>
            Start with the trip basics, add itinerary items as plans firm up, keep notes and places close by, then
            switch the trip to public when it is ready to share.
          </p>
        </div>
        <div className={styles.illustrationShell}>
          <Image src="/illusHome.svg" alt="Travelers reviewing a trip plan" width={520} height={520} priority />
        </div>
      </section>
    </>
  );
}
