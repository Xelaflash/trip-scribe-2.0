import Image from 'next/image';
// styles
import { SITE_TITLE } from '@/constants';

// constants
import styles from './Home.module.css';

// lib
// import prisma from '@/lib/prisma';

// Store
// import { useUserStore } from '@/store/UserStore';

// components
import { Button } from '@/components/ui/button';
import TitleAndLine from '@/components/TitleAndLine/TitleAndLine';

export default async function Home() {
  // ⚠️ Better to uuse react query for this
  // const users = await prisma.user.findMany();

  // Fetch your initial data in a Server Component higher up in the component tree, and pass it to your Client Component as a prop.
  // const initialData = await getUsers();

  return (
    <>
      <section className={styles.bgImgWrapper}>
        <div className={styles.homeContainer}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.homeTitle}>{SITE_TITLE}</h1>
            <h2 className={styles.homeSubTitle}>Plan, Capture, and Share Your Travel Adventures</h2>
            <Button size="lg" className="mt-4 px-14 py-2 text-md font-bold hover:shadow-sm bg-primary-700">
              Get Started
            </Button>
          </div>
        </div>
      </section>
      {/* TODO: here Featured Trips section with TripCARD */}
      <section className={styles.explinationContainer}>
        <div className={styles.explinationWrapper}>
          <TitleAndLine color={`var(--color-primary-700)`} title="How it works" />
          <div className="flex justify-between px-10">
            <Image src="/illusHome.svg" alt="Illustration of a travelers" width={400} height={800} />
            <aside className="max-w-3xl">
              <p className="text-xl font-medium text-left mb-8">
                Embark on unforgettable journeys with ease using our all-in-one travel app. <br />
                Plan, experience, and cherish your adventures like never before. Trip Scribe offers a rich array of
                features to make your trips seamless and memorable:
              </p>
              <ul className={styles.explinationList}>
                <li>📅 Comprehensive Calendar: Stay organized with a detailed trip itinerary.</li>
                <li>📝 Notes & To-Do Lists: Keep track of important details and tasks.</li>
                <li>📍 Address Book: Categorize landmarks, shops, bars, and more for quick access.</li>
                <li>📷 Capture moments with photos and comments.</li>
                <li>💰 Budget Tracker: Monitor expenses with category-specific alerts.</li>
                <li>🖼️ Image Gallery: Create visual memories of your travels.</li>
                <li>📔 Diary-like Journal: Chronicle your experiences for future nostalgia.</li>
                <li>🤝 Social: Share and Connect with people you love or with your fellow scribers.</li>
              </ul>
              <p className="text-2xl font-medium mt-12 text-center">
                With Trip Scribe, every trip becomes a cherished story waiting to be told. <br />
                <Button variant="link" className="text-2xl font-bold uppercase my-4">
                  Start your journey today!
                </Button>
              </p>
            </aside>
          </div>
        </div>
      </section>
      <section className={styles.stepSectionWrapper}>
        {/* A kind of step to explain:
        1. create your trip in your profile page
        2. Add content to your trip (calendar, notes, addresses, etc)
        3. Share your trip with your friends
         */}

        {/* timeline with hand drawn svg arrow going from left to rigfht */}
        <TitleAndLine color={`var(--color-backdrop)`} title="As Easy as 1, 2, 3" />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tenetur consequuntur reiciendis necessitatibus
          quis, magni suscipit voluptates excepturi quas similique debitis aliquam in vel dolorem possimus incidunt
          voluptatem deserunt esse! Omnis vero, error blanditiis ipsa consequatur exercitationem nisi ad a recusandae
          maxime soluta ullam ratione nobis minima voluptatem obcaecati, est repellendus. Laborum vel laboriosam quasi
          numquam dolores quae minus ex. Facere quo quis maiores possimus necessitatibus repellendus distinctio
          excepturi magni explicabo nobis perferendis numquam et iure, architecto tenetur nesciunt animi fugit repellat
          rerum accusamus. Natus delectus eaque quasi debitis et. Officiis possimus iure sed repellat a modi commodi
          deserunt optio esse, neque perspiciatis, alias vel nihil reiciendis provident officia magnam aperiam
          voluptatem saepe ex nulla, sunt autem quibusdam quo! Minima. At quo earum asperiores necessitatibus
          accusantium ut ducimus magni a. Animi odit dolore voluptates repudiandae ullam id iure minima dicta aut rerum.
          A illo fuga consectetur facilis unde, placeat at.
        </p>
      </section>
    </>
  );
}
