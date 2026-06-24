import Link from 'next/link';

import Logo from '@/components/Logo/Logo';

import DecorativeSwoops from './DecorativeSwoops';

// import { useCurrentUser } from '@/hooks/useCurrentUser';

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <div className="relative flex justify-center text-center sm:pb-16 sm:text-start">
      <DecorativeSwoops />
      <div className="relative flex w-full max-w-contentWidth flex-col items-center gap-16 px-viewportPadding pt-8 pb-12 sm:flex-row sm:justify-between sm:gap-8">
        <div>
          <Logo mobileAlignment="center" />
          <p className="mt-6 max-w-72 text-sm text-muted-foreground">© {date} Trip Scribe. All rights reserved.</p>
        </div>
        <nav>
          <h2 className="text-xl">Links</h2>
          <ul className="mt-6 list-none space-y-2 p-0">
            <li></li>
            <li>
              <Link href="/todo" className="text-base no-underline">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/todo" className="text-base no-underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Footer;
