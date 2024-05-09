import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultUser, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs";
import TwitterProvider from "next-auth/providers/twitter";
import * as auth from "../db/schema/auth";
import { Keypair } from "@solana/web3.js";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
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
      return session;
    },
  },

  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID!,
      clientSecret: env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      profile(response) {
        const data = response.data;
        const newWallet = new Keypair();
        const walletAddress = newWallet.publicKey.toString();
        const privateKey = JSON.stringify(newWallet.secretKey);
        return {
          id: data.id,
          isAdmin: false,
          defaultURL: "/trade",
          userType: "user",
          email: undefined,
          image: data.profile_image_url,
          name: data.name,
          username: data.username,
          walletAddress,
          privateKey,
        };
      },
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
