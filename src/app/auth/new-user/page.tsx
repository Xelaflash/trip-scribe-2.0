import Image from 'next/image';

import { NewUserForm } from './NewUserForm';

const NewUser = () => {
  return (
    <section className="px-viewportPadding py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-outerContentWidth overflow-hidden rounded-4xl border border-border bg-card/95 text-card-foreground shadow-elevationMedium backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72 bg-emerald-950 sm:min-h-88 lg:min-h-150">
          <Image
            src="/pics/pexels-simon73-1118448.jpg"
            alt="Sunlit rice terraces below a mountain"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--foreground)/0.03),hsl(var(--foreground)/0.58))]" />
          <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
            <p className="text-xs font-black tracking-[0.18em] text-mint-100 uppercase">Welcome aboard</p>
            <p className="mt-2 max-w-md text-3xl leading-tight font-black sm:text-4xl">
              Name your workspace before the planning starts.
            </p>
          </div>
        </div>

        <div className="flex items-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-xl">
            <p className="text-xs font-black tracking-[0.18em] text-secondary uppercase">Finish setup</p>
            <h1 className="mt-3 text-4xl leading-tight font-black text-card-foreground md:text-5xl">
              What should we call you?
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Add your name so Trip Scribe can personalize your private trip workspace and shared travel plans.
            </p>
            <NewUserForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewUser;
