import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type LogoProps = {
  mobileAlignment?: 'left' | 'center';
};

const Logo = ({ mobileAlignment = 'left' }: LogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        'block text-xl font-semibold tracking-normal no-underline transition-[font-weight,transform] duration-[400ms] will-change-transform sm:text-2xl',
        mobileAlignment === 'center' && 'max-sm:text-center',
      )}
    >
      <Image src="/logo.svg" width={150} height={100} alt="Trip Scribe logo" className="size-auto" />
    </Link>
  );
};

export default Logo;
