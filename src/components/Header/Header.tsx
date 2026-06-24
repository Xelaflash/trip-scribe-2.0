'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// components
import Logo from '../Logo/Logo';
import Links from './components/Links';

const authLinkClassName =
  'inline-flex min-h-[2.65rem] items-center justify-center rounded-full border border-white/25 bg-primary/90 px-[1.15rem] text-[0.95rem] font-extrabold text-white no-underline transition-colors hover:bg-secondary';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="relative z-10 flex min-h-headerHeight w-full items-center justify-between bg-primary-950/70 px-viewportPadding text-white shadow-[var(--shadow-elevation-low)] backdrop-blur-2xl">
      <Logo />
      <Links />
      {!session ? (
        <Link href="/auth/signin" className={authLinkClassName}>
          Log In
        </Link>
      ) : (
        <button
          type="button"
          className={authLinkClassName}
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
