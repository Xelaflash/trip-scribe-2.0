import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type LogoProps = {
  mobileAlignment?: 'left' | 'center';
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const Logo = ({ mobileAlignment = 'left', withText = true, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-18',
    md: 'w-48',
    lg: 'w-64',
  };

  return (
    <Link href="/" className={cn(mobileAlignment === 'center' && 'max-sm:text-center')}>
      {withText ? (
        <Image
          src="/logo_full.svg"
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
