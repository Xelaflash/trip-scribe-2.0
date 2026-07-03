'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// components
import Logo from '../Logo/Logo';
import Links from './components/Links';
import ThemeModeToggle from '@/components/ThemeModeToggle/ThemeModeToggle';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="relative z-10 flex min-h-headerHeight w-full items-center justify-between gap-3 border-b border-border bg-card/85 px-viewportPadding text-card-foreground shadow-elevationLow backdrop-blur-2xl">
      <Logo withText={false} size="sm" />
      <Links />
      <div className="flex items-center gap-2">
        <ThemeModeToggle />
        {!session ? (
          <Link
            href="/auth/signin"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-extrabold text-card-foreground no-underline transition hover:bg-accent hover:text-accent-foreground"
          >
            Log In
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-extrabold text-card-foreground no-underline transition hover:bg-accent hover:text-accent-foreground"
            onClick={() =>
              signOut({ redirect: false }).then(() => {
                router.push('/');
              })
            }
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
