'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';

import ThemeModeToggle from '@/components/ThemeModeToggle/ThemeModeToggle';
import { cn } from '@/lib/utils';

const unauthenticatedLinks = [{ name: 'How it works', href: '/how-it-works' }];

const authenticatedLinks = [
  { name: 'Trips', href: '/trips' },
  { name: 'How it works', href: '/how-it-works' },
];

const navLinkClass =
  'rounded-full md:text-base px-6 py-3 text-sm lg:text-base font-[750] text-ink-700 no-underline transition-colors duration-200 ease-out hover:bg-[linear-gradient(135deg,var(--button-primary-gradient-from),var(--button-primary-gradient-to))] hover:text-[var(--button-primary-foreground)] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:text-muted-foreground dark:hover:text-[var(--button-primary-foreground)]';

const activeNavLinkClass =
  'bg-[linear-gradient(135deg,var(--button-primary-gradient-from),var(--button-primary-gradient-to))] text-[var(--button-primary-foreground)] dark:text-[var(--button-primary-foreground)]';

const actionClass =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-sand-100 px-6 py-3 text-sm lg:text-base font-bold text-ink-950 no-underline transition-colors duration-200 ease-out hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none dark:border-sand-50 dark:text-muted-foreground dark:hover:bg-ink-700 dark:hover:text-foreground';

const activeActionClass = 'bg-muted dark:bg-ink-700 dark:text-foreground';

const desktopMediaQuery = '(min-width: 768px)';

const subscribeToDesktopViewport = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(desktopMediaQuery);
  mediaQueryList.addEventListener('change', onStoreChange);

  return () => {
    mediaQueryList.removeEventListener('change', onStoreChange);
  };
};

const getDesktopViewportSnapshot = () => {
  return typeof window !== 'undefined' && window.matchMedia(desktopMediaQuery).matches;
};

const getDesktopViewportServerSnapshot = () => false;

const getPageHref = (href: string) => href.split('#')[0] || '/';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopViewport,
    getDesktopViewportSnapshot,
    getDesktopViewportServerSnapshot,
  );
  const links = session ? authenticatedLinks : unauthenticatedLinks;

  const closeMenu = () => setIsMenuOpen(false);

  const isActivePage = (href: string) => {
    const pageHref = getPageHref(href);

    return pageHref !== '/' && pageHref === pathname;
  };

  const handleSignOut = async () => {
    closeMenu();
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <header className=" px-viewportPadding py-4 md:py-8">
      <div className="mx-auto flex min-h-20 w-full max-w-outerContentWidth items-center justify-between gap-4 rounded-full border border-sand-50 bg-card/90 px-5 py-3 shadow-elevationLow backdrop-blur-2xl md:px-6">
        <Link
          href="/"
          className="inline-flex min-w-0 shrink-0 items-center rounded-full no-underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          onClick={closeMenu}
        >
          <Image
            src="/logo.svg"
            width={450}
            height={300}
            alt="Trip Scribe"
            className="h-10 w-auto  object-contain md:h-12 md:max-w-none"
            priority
          />

          <span className="truncate text-lg lg:text-2xl font-black tracking-normal ml-2 text-ink-950 dark:text-muted-foreground">
            Trip Scribe
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-2">
          <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
            {links.map((link) => {
              const isActive = isActivePage(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(navLinkClass, isActive && activeNavLinkClass)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <ThemeModeToggle />

          {isDesktop &&
            !isMenuOpen &&
            (session ? (
              <button type="button" className={actionClass} onClick={handleSignOut}>
                Log out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className={cn(actionClass, isActivePage('/auth/signin') && activeActionClass)}
                aria-current={isActivePage('/auth/signin') ? 'page' : undefined}
              >
                Log in
              </Link>
            ))}

          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full border border-[rgba(8,47,43,0.10)] bg-transparent text-card-foreground transition hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none md:hidden dark:border-white/15"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mx-auto mt-3 grid w-full max-w-outerContentWidth gap-2 rounded-3xl border border-[rgba(8,47,43,0.10)] bg-card/95 p-3 shadow-elevationMedium backdrop-blur-2xl md:hidden dark:border-white/15"
        >
          {links.map((link) => {
            const isActive = isActivePage(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(navLinkClass, isActive && activeNavLinkClass)}
                aria-current={isActive ? 'page' : undefined}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            );
          })}
          {session ? (
            <button type="button" className={cn(actionClass, 'w-full')} onClick={handleSignOut}>
              Log out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className={cn(actionClass, 'w-full', isActivePage('/auth/signin') && activeActionClass)}
              aria-current={isActivePage('/auth/signin') ? 'page' : undefined}
              onClick={closeMenu}
            >
              Log in
            </Link>
          )}
        </nav>
      ) : null}
    </header>
  );
};

export default Header;
