import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type TokenId, tokenIdSchema, tokens } from "@/lib/db/schema/tokens";

export const getTokens = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(tokens)
    .where(eq(tokens.userId, session?.user.id!));
  const t = rows;
  return { tokens: t };
};

export const getAllTokens = async () => {
  const rows = await db.select().from(tokens).where(eq(tokens.listing, true));
  const t = rows;
  return { tokens: t };
};

export const getTokenById = async (id: TokenId) => {
  const { session } = await getUserAuth();
  const { id: tokenId } = tokenIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(tokens)
    .where(and(eq(tokens.id, tokenId), eq(tokens.userId, session?.user.id!)));
  if (row === undefined) return {};
  const t = row;
  return { token: t };
};
