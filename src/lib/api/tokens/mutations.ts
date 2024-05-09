import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  TokenId,
  NewTokenParams,
  UpdateTokenParams,
  updateTokenSchema,
  insertTokenSchema,
  tokens,
  tokenIdSchema,
} from "@/lib/db/schema/tokens";
import { getUserAuth } from "@/lib/auth/utils";

export const createToken = async (token: NewTokenParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.isAdmin) throw { message: "Not admin user" };
  const newToken = insertTokenSchema.parse({
    ...token,
    userId: session?.user.id!,
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
  const { session } = await getUserAuth();
  if (!session?.user.isAdmin) throw { message: "Not admin user" };
  const { id: tokenId } = tokenIdSchema.parse({ id });
  const newToken = updateTokenSchema.parse({
    ...token,
    userId: session?.user.id!,
  });
  try {
    const [t] = await db
      .update(tokens)
      .set({ ...newToken, updatedAt: new Date() })
      .where(and(eq(tokens.id, tokenId!), eq(tokens.userId, session?.user.id!)))
      .returning();
    return { token: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const deleteToken = async (id: TokenId) => {
  const { session } = await getUserAuth();
  if (!session?.user.isAdmin) throw { message: "Not admin user" };
  const { id: tokenId } = tokenIdSchema.parse({ id });
  try {
    const [t] = await db
      .delete(tokens)
      .where(and(eq(tokens.id, tokenId!), eq(tokens.userId, session?.user.id!)))
      .returning();
    return { token: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};
