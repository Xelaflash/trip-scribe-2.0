import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';

const isE2eTestAuthEnabled = process.env.E2E_TEST_AUTH === '1';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  ...(isE2eTestAuthEnabled ? { session: { strategy: 'jwt' } as const } : {}),
  providers: [
    ...(isE2eTestAuthEnabled
      ? [
          CredentialsProvider({
            id: 'e2e',
            name: 'E2E',
            credentials: {
              email: { label: 'Email', type: 'email' },
            },
            authorize: async (credentials) => {
              const email = credentials?.email;

              if (!email) {
                return null;
              }

              const user = await prisma.user.findUnique({
                where: { email },
              });

              return user
                ? {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                  }
                : null;
            },
          }),
        ]
      : []),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_API_KEY,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    newUser: '/auth/new-user',
  },
  callbacks: {
    session: async ({ session, token, user }) => {
      if (session?.user) {
        session.user.id = user?.id ?? token.sub ?? '';
      }
      return session;
    },
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   return true;
    // },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
