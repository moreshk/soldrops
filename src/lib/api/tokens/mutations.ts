import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import fetch from "cross-fetch";
import bs58 from "bs58";
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
import { users } from "@/lib/db/schema/auth";
import { env } from "@/lib/env.mjs";
import CryptoJS from "crypto-js";
import { getSignature } from "@/lib/tokens/utils/getSignature";
import { transactionSenderAndConfirmationWaiter } from "@/lib/tokens/utils/transactionSender";

const connection = new Connection(env.HELIUS_RPC_URL);

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

export const swapToken = async (amountQuoteUrl: string) => {
  try {
    const { session } = await getUserAuth();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user.id!));
    const hashedPrivatekey = user.privateKey;
    var decrypt = CryptoJS.AES.decrypt(hashedPrivatekey, env.DECODE_ENCODE_KEY);
    const privateKey = bs58.encode(
      Uint8Array.from(
        decrypt
          .toString(CryptoJS.enc.Utf8)
          .split(",")
          .map((a) => Number(a))
      )
    );
    const wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
    const quoteResponseData = await fetch(`${amountQuoteUrl}`);
    const quoteResponse = await quoteResponseData.json();
    const swapTransactionData = await fetch(
      "https://quote-api.jup.ag/v6/swap",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: user.walletAddress,
          wrapAndUnwrapSol: true,
          // feeAccount: "9BAa8bSQrUAT3nipra5bt3DJbW2Wyqfc2SXw3vGcjpbj",
          prioritizationFeeLamports: "auto",
        }),
      }
    );
    const { swapTransaction, lastValidBlockHeight } =
      await swapTransactionData.json();
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    transaction.sign([wallet]);
    const signature = getSignature(transaction);

    const { value: simulatedTransactionResponse } =
      await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true,
        commitment: "processed",
      });
    const { err, logs } = simulatedTransactionResponse;
    if (err) {
      console.error("Simulation Error:");
      console.error({ err, logs });
      return { message: "Simulation Error:" };
    }

    const serializedTransaction = Buffer.from(transaction.serialize());
    const blockhash = transaction.message.recentBlockhash;

    const transactionResponse = await transactionSenderAndConfirmationWaiter({
      connection,
      serializedTransaction,
      blockhashWithExpiryBlockHeight: {
        blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      },
    });

    if (!transactionResponse) {
      console.error("Transaction not confirmed");
      return { message: "Transaction not confirmed" };
    }
    return { signature };
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
