import { db } from "@/lib/db/index";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  DefaultUser,
  getServerSession,
  NextAuthOptions,
  User,
} from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs";
import TwitterProvider from "next-auth/providers/twitter";
import * as auth from "../db/schema/auth";
import { Keypair } from "@solana/web3.js";
import CryptoJS from "crypto-js";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { encode, decode } from "next-auth/jwt";

declare module "next-auth" {
  export interface User extends DefaultUser {
    id: string;
    isAdmin: boolean;
    userType: string;
    defaultURL: string;
    username?: string;
    walletAddress?: string;
    email?: string;
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
      username?: string;
      defaultURL: string;
      walletAddress: string;
    };
  } | null;
};
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    accountsTable: auth.accounts,
    // @ts-expect-error
    usersTable: auth.users,
    sessionsTable: auth.sessions,
    verificationTokensTable: auth.verificationTokens,
  }) as Adapter,
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.walletAddress = user.walletAddress;
        token.userType = user.userType;
        token.email = user.email;
        token.defaultURL = user.defaultURL;
      }
      return token;
    },
    session: ({ session, token }) => {
      const value = token as unknown as User;
      if (value) {
        session.user.id = value.id;
        session.user.isAdmin = value.isAdmin;
        session.user.walletAddress = value.walletAddress;
        session.user.userType = value.userType;
        session.user.email = value.email;
        session.user.defaultURL = value.defaultURL;
        session.user.username = value.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: { encode, decode },
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID!,
      clientSecret: env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      profile(response) {
        const data = response.data;
        const newWallet = new Keypair();
        const walletAddress = newWallet.publicKey.toString();
        var privateKey = CryptoJS.AES.encrypt(
          newWallet.secretKey.toString(),
          env.DECODE_ENCODE_KEY
        ).toString();
        return {
          id: data.id,
          isAdmin: false,
          defaultURL: "/swap",
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
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { email, password } = await auth.loginSchema.parseAsync(
            credentials
          );
          const [user] = await db
            .select()
            .from(auth.users)
            .where(eq(auth.users.email, email));

          if (user && user.password) {
            const isValidPassword = await compare(password, user.password);
            if (isValidPassword) {
              const userDetails: User = {
                id: user.id,
                isAdmin: user.isAdmin || false,
                userType: user.userType || "user",
                email: user.email || undefined,
                image: user.image || undefined,
                name: user.name || undefined,
                username: user.name || undefined,
                walletAddress: user.walletAddress,
                defaultURL: user.defaultURL || "/",
              };
              return userDetails;
            }
          }
          return null;
        } catch (error) {
          return null;
        }
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
