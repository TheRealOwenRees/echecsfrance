import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";

import { clientPromise } from "@/server/mongodb";
import Email from "@/utils/nodemailerProvider";

export const adapter = MongoDBAdapter(clientPromise, {
  databaseName: "userData",
});

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter,

  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  pages: {
    signIn: "/auth/sign-in",
  },
});
