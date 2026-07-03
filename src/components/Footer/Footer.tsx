import Link from 'next/link';

import Logo from '@/components/Logo/Logo';

import DecorativeSwoops from './DecorativeSwoops';

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <div>
      <div className="relative flex justify-center border-t border-border text-center sm:pb-16 sm:text-start ">
        <DecorativeSwoops />
        <div className="relative flex w-full max-w-contentWidth flex-col items-center gap-16  pt-8 sm:flex-row sm:justify-between sm:gap-8">
          <div className="mt-6">
            <Logo mobileAlignment="center" size="lg" />
          </div>
          <nav className="mt-10">
            <h2 className="text-base font-extrabold text-foreground">Links</h2>
            <ul className="mt-6 list-none space-y-2 p-0">
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
      <p className="flex items-center justify-center p-4 max-w-sm text-base text-muted-foreground w-max mx-auto">
        © {date} Trip Scribe. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
