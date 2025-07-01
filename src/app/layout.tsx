import type { Metadata } from 'next';

// libs
import { Work_Sans } from 'next/font/google';
import clsx from 'clsx';

// constants
import { SITE_TITLE, SITE_DESCRIPTION } from '@/constants';
// styles
import './globals.css';

// providers
import TanStackProviders from '@/lib/tanStackProvider';
import { AuthProvider } from '@/lib/authProvider';

// components
import RespectMotionPreference from '@/components/RespectMotionPreference/RespectMotionPreference';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const mainFont = Work_Sans({
  subsets: ['latin'],
  display: 'fallback',
  weight: 'variable',
  variable: '--font-work-sans',
});
// const mainFont = Raleway({
//   subsets: ['latin'],
//   display: 'fallback',
//   weight: 'variable',
//   variable: '--font-main',
// });

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RespectMotionPreference>
      <html lang="en">
        <body className={clsx(mainFont.variable)}>
          <AuthProvider>
            <TanStackProviders>
              <Header />
              <main>{children}</main>
              <Footer />
            </TanStackProviders>
          </AuthProvider>
        </body>
      </html>
    </RespectMotionPreference>
  );
}
