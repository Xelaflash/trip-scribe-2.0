import Image from 'next/image';

import SignInForm from './SignInForm';

const SignIn = () => {
  return (
    <section className="px-viewportPadding py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-outerContentWidth items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <div className="order-2 w-full rounded-3xl border border-border bg-card/95 text-card-foreground shadow-elevationMedium backdrop-blur-xl lg:order-1">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-black tracking-[0.18em] text-secondary uppercase">Trip workspace</p>
            <h1 className="mt-3 text-4xl leading-tight font-black text-card-foreground md:text-5xl">
              Sign in to keep planning.
            </h1>
            <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Continue to your saved trips, itinerary notes, places, and shared travel plans.
            </p>
            <SignInForm />
          </div>
        </div>

        <div className="order-1 overflow-hidden rounded-4xl bg-emerald-950 shadow-elevationMedium lg:order-2">
          <div className="relative min-h-80 md:min-h-120 lg:min-h-[42rem]">
            <Image
              src="/signin-landscape.jpg"
              alt="Sunlit rice terraces below a mountain"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--foreground)/0.02),hsl(var(--foreground)/0.5))]" />
            <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/20 bg-ink-950/55 p-5 text-white shadow-elevationMedium backdrop-blur-xl sm:inset-x-7 sm:bottom-7 sm:p-6">
              <p className="text-xs font-black tracking-[0.18em] text-mint-100 uppercase">Plan with context</p>
              <p className="mt-2 text-2xl leading-tight font-black sm:text-3xl">
                Every date, note, and place in one calm workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
