import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs"
import TwitterProvider from "next-auth/providers/twitter";


declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
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
      version: "2.0"
    })
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
