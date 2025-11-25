import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      usn: string;
      name: string;
      mobile: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    usn: string;
    mobile: string;
    role: string;
  }
}
