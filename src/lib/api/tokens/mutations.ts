import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  AddressLookupTableAccount,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
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
import { QuoteResponse } from "@jup-ag/api";
import { getFeeAddress } from "@/lib/tokens/utils/getFeeAddress";
import { solToken } from "@/lib/tokens/utils/defaultTokens";
import { TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";

export const connection = new Connection(env.HELIUS_RPC_URL);

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

export const swapTokenOutputFee = async (amountQuoteUrl: string) => {
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
    const quoteResponseData = await fetch(
      `${amountQuoteUrl}&platformFeeBps=100`
    );
    const quoteResponse: QuoteResponse = await quoteResponseData.json();
    const feeWallet = new PublicKey(
      "9BAa8bSQrUAT3nipra5bt3DJbW2Wyqfc2SXw3vGcjpbj"
    );

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
        }),
      }
    );
    const { swapTransaction, lastValidBlockHeight } =
      await swapTransactionData.json();
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const splMintToken =
      quoteResponse.outputMint === solToken.address
        ? quoteResponse.inputMint
        : quoteResponse.outputMint;

    const addressLookupTableAccounts = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(
            await connection.getAccountInfo(lookup.accountKey).then(
              // @ts-ignore
              (res) => res.data
            )
          ),
        });
      })
    );
    var message = TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts: addressLookupTableAccounts,
    });

    if (quoteResponse.outputMint === solToken.address) {
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: feeWallet,
        lamports: +quoteResponse.platformFee?.amount!,
      });
      message.instructions.push(solTransferInstruction);
    } else {
      const { ix, pubkey: feeAta } = await getFeeAddress(
        connection,
        feeWallet,
        new PublicKey(splMintToken),
        wallet.publicKey
      );
      const { pubkey: senderAta } = await getFeeAddress(
        connection,
        wallet.publicKey,
        new PublicKey(splMintToken),
        wallet.publicKey
      );
      if (ix) message.instructions.push(ix);
      const feeTx = createTransferInstruction(
        senderAta,
        feeAta,
        wallet.publicKey,
        +quoteResponse.platformFee?.amount!,
        [wallet.publicKey],
        TOKEN_PROGRAM_ID
      );
      message.instructions.push(feeTx);
    }
    transaction.message = message.compileToV0Message(
      addressLookupTableAccounts
    );

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
    const quoteResponseData = await fetch(
      `${amountQuoteUrl}&platformFeeBps=100`
    );
    const quoteResponse: QuoteResponse = await quoteResponseData.json();
    const feeWallet = new PublicKey(
      "9BAa8bSQrUAT3nipra5bt3DJbW2Wyqfc2SXw3vGcjpbj"
    );

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
        }),
      }
    );
    const { swapTransaction, lastValidBlockHeight } =
      await swapTransactionData.json();
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const splMintToken =
      quoteResponse.outputMint === solToken.address
        ? quoteResponse.inputMint
        : quoteResponse.outputMint;

    const addressLookupTableAccounts = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(
            await connection.getAccountInfo(lookup.accountKey).then(
              // @ts-ignore
              (res) => res.data
            )
          ),
        });
      })
    );
    var message = TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts: addressLookupTableAccounts,
    });

    if (quoteResponse.outputMint === solToken.address) {
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: feeWallet,
        lamports: +quoteResponse.platformFee?.amount!,
      });
      message.instructions.push(solTransferInstruction);
    } else {
      const fees = +quoteResponse.inAmount / 100;
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: feeWallet,
        lamports: fees,
      });
      message.instructions.push(solTransferInstruction);
    }
    transaction.message = message.compileToV0Message(
      addressLookupTableAccounts
    );

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
