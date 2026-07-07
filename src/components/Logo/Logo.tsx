'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

type LogoProps = {
  mobileAlignment?: 'left' | 'center';
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const Logo = ({ mobileAlignment = 'left', withText = true, size = 'md' }: LogoProps) => {
  const { resolvedTheme } = useTheme();
  const sizeClasses = {
    sm: 'w-18',
    md: 'w-48',
    lg: 'w-64',
  };
  const logoSrc = resolvedTheme === 'dark' ? '/logo_full_dark.svg' : '/logo_full.svg';

  return (
    <Link href="/" className={cn(mobileAlignment === 'center' && 'max-sm:text-center')}>
      {withText ? (
        <Image
          src={logoSrc}
          width={450}
          height={300}
          alt="Trip Scribe logo"
          className={cn('size-auto', sizeClasses[size])}
          loading="eager"
        />
      ) : (
        <Image
          src="/logo.svg"
          width={200}
          height={200}
          alt="Trip Scribe logo"
          className={cn('size-auto', sizeClasses[size])}
          loading="eager"
        />
      )}
    </Link>
  );
};

export default Logo;
