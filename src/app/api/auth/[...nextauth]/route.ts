import { DefaultUser } from "next-auth";
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/utils";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    walletAddress?: string;
    isAdmin: boolean;
    userType: string;
    defaultURL: string;
  }
  interface Session {
    user: User;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
