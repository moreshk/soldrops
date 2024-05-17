import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type TokenId, tokenIdSchema, tokens } from "@/lib/db/schema/tokens";
import { connection } from "./mutations";
import { PublicKey } from "@solana/web3.js";
import { getATAAddressSync } from "@saberhq/token-utils";

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

export const getSolTokenBalance = async () => {
  try {
    const { session } = await getUserAuth();
    const walletAddress = new PublicKey(session?.user.walletAddress!);
    const balance = await connection.getBalance(walletAddress);
    return { balance };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const getSwapTokenBalance = async (id: TokenId) => {
  try {
    const { session } = await getUserAuth();
    const { id: tokenAddress } = tokenIdSchema.parse({ id });
    const walletAddress = new PublicKey(session?.user.walletAddress!);
    const solBalance = await connection.getBalance(walletAddress);

    const ataAtaAddress = getATAAddressSync({
      mint: new PublicKey(tokenAddress),
      owner: walletAddress,
    });
    try {
      const ataTokenBalance = await connection.getTokenAccountBalance(
        ataAtaAddress
      );
      return {
        solBalance,
        ataTokenBalance: ataTokenBalance.value.uiAmount ?? 0,
      };
    } catch (err) {
      const message = (err as Error).message ?? "Error, please try again";
      return { solBalance, ataTokenBalance: 0, message };
    }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const getATATokenBalance = async (id: TokenId) => {
  try {
    const { session } = await getUserAuth();
    const { id: tokenAddress } = tokenIdSchema.parse({ id });
    const walletAddress = new PublicKey(tokenAddress);
    const balance = await connection.getTokenAccountBalance(walletAddress);
    return { balance };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};
