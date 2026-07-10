declare module 'nodemailer' {
  export type SendMailOptions = {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
    attachments?: Array<{
      filename: string;
      path: string;
      cid: string;
    }>;
  };

  export type SentMessageInfo = {
    rejected?: string[];
    pending?: string[];
  };

  export function createTransport(options?: unknown): {
    sendMail(options: SendMailOptions): Promise<SentMessageInfo>;
  };
}
