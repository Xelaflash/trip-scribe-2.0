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
    <header className="relative z-10 flex min-h-headerHeight w-full items-center justify-between border-b border-white/10 bg-primary-950/85 px-viewportPadding text-white shadow-elevationLow backdrop-blur-2xl">
      <Logo />
      <Links />
      {!session ? (
        <Link
          href="/auth/signin"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 text-sm font-extrabold text-white no-underline transition hover:bg-secondary"
        >
          Log In
        </Link>
      ) : (
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 text-sm font-extrabold text-white no-underline transition hover:bg-secondary"
          onClick={() =>
            signOut({ redirect: false }).then(() => {
              router.push('/');
            })
          }
        >
          Log out
        </button>
      )}
    </header>
  );
};

export default Header;
