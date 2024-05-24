import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { tokens } from "@/lib/db/schema/tokens";
import { auth } from "@clerk/nextjs/server";
import { TokenId, tokenIdSchema } from "./tokens.type";

export const getUsersTokens = async () => {
  const { userId } = auth();
  const rows = await db.select().from(tokens).where(eq(tokens.userId, userId!));
  const t = rows;
  return { tokens: t };
};

export const getAllTokens = async () => {
  const rows = await db.select().from(tokens).where(eq(tokens.listing, true));
  const t = rows;
  return { tokens: t };
};

export const getTokenById = async (id: TokenId) => {
  const { userId } = auth();
  const { id: tokenId } = tokenIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(tokens)
    .where(and(eq(tokens.id, tokenId), eq(tokens.userId, userId!)));
  if (row === undefined) return {};
  const t = row;
  return { token: t };
};
