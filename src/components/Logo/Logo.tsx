'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

const subscribeToMount = () => {
  return () => {};
};

type LogoProps = {
  mobileAlignment?: 'left' | 'center';
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const Logo = ({ mobileAlignment = 'left', withText = true, size = 'md' }: LogoProps) => {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    () => true,
    () => false,
  );
  const { resolvedTheme } = useTheme();
  const sizeClasses = {
    sm: 'w-18',
    md: 'w-48',
    lg: 'w-64',
  };
  const logoSrc = isMounted && resolvedTheme === 'dark' ? '/logo_full_dark.svg' : '/logo_full.svg';

  return (
    <Link href="/" aria-label="Trip Scribe home" className={cn(mobileAlignment === 'center' && 'max-sm:text-center')}>
      {withText ? (
        <Image
          src={logoSrc}
          width={450}
          height={300}
          alt=""
          aria-hidden="true"
          className={cn('size-auto', sizeClasses[size])}
          loading="eager"
        />
      ) : (
        <Image
          src="/logo.svg"
          width={200}
          height={200}
          alt=""
          aria-hidden="true"
          className={cn('size-auto', sizeClasses[size])}
          loading="eager"
        />
      )}
    </Link>
  );
};

export default Logo;
