import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Email from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { options } from "prettier-plugin-tailwindcss";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise, { databaseName: 'userData' }) as Adapter,
  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
    })
  ]
})

export { handler as GET, handler as POST }
