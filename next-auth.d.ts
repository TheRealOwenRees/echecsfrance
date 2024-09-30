import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    locale?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    locale?: string;
  }
}
