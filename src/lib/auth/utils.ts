import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultUser, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs";
import TwitterProvider from "next-auth/providers/twitter";
import * as auth from "../db/schema/auth";

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

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      walletAddress?: string;
      isAdmin: boolean;
      userType: string;
      defaultURL: string;
    };
  } | null;
};
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    accountsTable: auth.accounts,
    // @ts-expect-error
    usersTable: auth.users,
    // @ts-expect-error
    sessionsTable: auth.sessions,
    verificationTokensTable: auth.verificationTokens,
  }) as Adapter,
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      session.user.walletAddress = user.walletAddress;
      return session;
    },
  },

  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID!,
      clientSecret: env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
};

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();
  if (!session) redirect("/");
};
