import Link from 'next/link';
import Logo from '../Logo/Logo';

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="mx-auto w-outerContentWidth overflow-hidden border-t border-border pt-10 pb-6 text-foreground">
      <div className="flex w-full flex-col items-center justify-between gap-8 md:items-end lg:flex-row">
        <div className="max-w-md">
          <Logo mobileAlignment="center" size="lg" />
        </div>
        <div className="flex flex-col items-center gap-6 md:items-end">
          <p className="mt-4 text-center text-lg leading-6 font-medium text-muted-foreground">
            Workspace design for trip creation, itinerary, notes, places, and sharing.
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex list-none flex-wrap gap-4 p-0 text-sm font-bold text-muted-foreground">
              <li>
                <Link
                  href="/todo"
                  className="rounded-md no-underline transition hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/todo"
                  className="rounded-md no-underline transition hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <p className="mx-auto mt-10 w-full text-center text-sm text-muted-foreground">
        © {date} Trip Scribe. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
