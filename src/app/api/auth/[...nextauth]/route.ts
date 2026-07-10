import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createTransport } from 'nodemailer';
import path from 'node:path';

import { SITE_TITLE } from '@/constants';
import prisma from '@/lib/prisma';

const isE2eTestAuthEnabled = process.env.E2E_TEST_AUTH === '1';
const emailLogoCid = 'trip-scribe-logo';
const emailLogoPath = path.join(process.cwd(), 'public', 'logo.jpg');

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const buildVerificationEmailHtml = ({ url }: { url: string }) => {
  const escapedUrl = escapeHtml(url);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sign in to ${SITE_TITLE}</title>
  </head>
  <body style="margin:0;padding:0;background:#f8f3e8;color:#092420;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f3e8;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid #e4d7c1;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="cid:${emailLogoCid}" width="500" height="80" alt="" style="display:block;width:60px;max-width:100%;height:auto;border:0;" />
                    </td>
                    <td style="padding:0 0 0 0px;vertical-align:middle;">
                      <span style="display:block;color:#092420;font-size:32px;font-weight:900;letter-spacing:normal;margin:0;">${SITE_TITLE}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 10px;color:#ff7a3d;font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;">Secure sign-in</p>
                <h1 style="margin:0;color:#092420;font-size:30px;line-height:1.15;font-weight:900;">Open your trip workspace.</h1>
                <p style="margin:16px 0 28px;color:#3f5954;font-size:16px;line-height:1.65;">
                  Use this magic link to sign in to ${SITE_TITLE}. It is private to you and expires automatically.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td bgcolor="#0d8067" style="border-radius:999px;">
                      <a href="${escapedUrl}" target="_blank" style="display:inline-block;padding:14px 22px;color:#ffffff;font-size:15px;font-weight:800;line-height:1;text-decoration:none;border-radius:999px;">
                        Continue to ${SITE_TITLE}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:28px 0 0;color:#6f817c;font-size:13px;line-height:1.6;">
                  If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="margin:8px 0 0;color:#0f6d59;font-size:13px;line-height:1.6;word-break:break-all;">
                  <a href="${escapedUrl}" style="color:#0f6d59;text-decoration:underline;">${escapedUrl}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 30px;border-top:1px solid #efe4d1;">
                <p style="margin:0;color:#7c8b87;font-size:12px;line-height:1.6;">
                  You can ignore this email if you did not request a sign-in link.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const buildVerificationEmailText = ({ url }: { url: string }) => {
  return `Sign in to ${SITE_TITLE}\n\nOpen your trip workspace with this magic link:\n${url}\n\nIf you did not request this email, you can ignore it.`;
};

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
      async sendVerificationRequest({ identifier, url, provider }) {
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${SITE_TITLE}`,
          text: buildVerificationEmailText({ url }),
          html: buildVerificationEmailHtml({ url }),
          attachments: [
            {
              filename: 'trip-scribe-logo.png',
              path: emailLogoPath,
              cid: emailLogoCid,
            },
          ],
        });
        const failed = [...(result.rejected ?? []), ...(result.pending ?? [])].filter(Boolean);

        if (failed.length) {
          throw new Error(`Email (${failed.join(', ')}) could not be sent`);
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    verifyRequest: '/auth/verify-request',
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
