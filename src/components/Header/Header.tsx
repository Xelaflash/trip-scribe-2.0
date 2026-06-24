'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// components
import Logo from '../Logo/Logo';
import Links from './components/Links';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="relative z-10 flex min-h-headerHeight w-full items-center justify-between bg-[hsl(171deg_74%_9%/0.72)]px-viewportPadding text-white shadow-elevationLow backdrop-blur-2xl px-8">
      <Logo />
      <Links />
      {!session ? (
        <Link
          href="/auth/signin"
          className="inline-flex min-h-[2.65rem] items-center justify-center rounded-full border border-white/25 bg-[hsl(168deg_74%_24%/0.88)] px-[1.15rem] text-[0.95rem] font-extrabold text-white no-underline hover:bg-secondary"
        >
          Log In
        </Link>
      ) : (
        <button
          type="button"
          className="inline-flex min-h-[2.65rem] items-center justify-center rounded-full border border-white/25 bg-[hsl(168deg_74%_24%/0.88)] px-[1.15rem] text-[0.95rem] font-extrabold text-white no-underline hover:bg-secondary"
          onClick={() =>
            signOut({ redirect: false }).then(() => {
              router.push('/');
            })
          }
        >
          Log out 😢
        </button>
      )}
    </header>
  );
};

export default Header;
