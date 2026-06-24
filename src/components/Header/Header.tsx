'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// libs
import clsx from 'clsx';

// styles
import styles from './Header.module.css';

// components
import Logo from '../Logo/Logo';
import Links from './components/Links';

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className={clsx(styles.wrapper)}>
      <Logo />
      <Links />
      {!session ? (
        <Link href="/auth/signin" className={styles.authLink}>
          Log In
        </Link>
      ) : (
        <button
          type="button"
          className={styles.authLink}
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
}
