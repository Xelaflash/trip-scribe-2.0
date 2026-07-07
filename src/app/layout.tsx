import type { Metadata } from 'next';

// libs
import { Inter } from 'next/font/google';
import clsx from 'clsx';

// constants
import { SITE_TITLE, SITE_DESCRIPTION } from '@/constants';
// styles
import './globals.css';

// providers
import TanStackProviders from '@/lib/tanStackProvider';
import { AuthProvider } from '@/lib/authProvider';
import { ThemeProvider } from '@/lib/themeProvider';

// components
import RespectMotionPreference from '@/components/RespectMotionPreference/RespectMotionPreference';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Toaster } from '@/components/ui/sonner';

export const mainFont = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-main',
  display: 'swap',
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RespectMotionPreference>
      <html lang="en" suppressHydrationWarning>
        <body className={clsx(mainFont.variable)}>
          <ThemeProvider>
            <AuthProvider>
              <TanStackProviders>
                <Header />
                <main>{children}</main>
                <Footer />
                <Toaster richColors position="bottom-right" />
              </TanStackProviders>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </RespectMotionPreference>
  );
};

export default RootLayout;
