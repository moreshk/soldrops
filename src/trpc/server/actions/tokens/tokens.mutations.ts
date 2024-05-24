import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { tokens } from "@/lib/db/schema/tokens";
import {
  TokenId,
  NewTokenParams,
  UpdateTokenParams,
  updateTokenSchema,
  insertTokenSchema,
  tokenIdSchema,
} from "./tokens.type";
import { auth } from "@clerk/nextjs/server";

export const createToken = async (token: NewTokenParams) => {
  const { userId } = auth();
  const newToken = insertTokenSchema.parse({
    ...token,
    userId: userId,
  });
  try {
    const [t] = await db.insert(tokens).values(newToken).returning();
    return { token: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const updateToken = async (id: TokenId, token: UpdateTokenParams) => {
  const { userId, sessionClaims } = auth().protect();
  const isAdmin = sessionClaims.userType === "admin";

  if (!isAdmin) throw { message: "Not admin user" };
  const { id: tokenId } = tokenIdSchema.parse({ id });
  const newToken = updateTokenSchema.parse({
    ...token,
    userId: userId!,
  });
  try {
    const [t] = await db
      .update(tokens)
      .set({ ...newToken, updatedAt: new Date() })
      .where(and(eq(tokens.id, tokenId!), eq(tokens.userId, userId!)))
      .returning();
    return { token: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const deleteToken = async (id: TokenId) => {
  const { userId, sessionClaims } = auth().protect();
  const isAdmin = sessionClaims.userType === "admin";
  if (!isAdmin) throw { message: "Not admin user" };
  const { id: tokenId } = tokenIdSchema.parse({ id });
  try {
    const [t] = await db
      .delete(tokens)
      .where(and(eq(tokens.id, tokenId!), eq(tokens.userId, userId!)))
      .returning();
    return { token: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};
