import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
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
import { getUserAuth } from "@/lib/auth/utils";
import { users } from "@/lib/db/schema/auth";
import { env } from "@/lib/env.mjs";
import CryptoJS from "crypto-js";
import { getSignature } from "@/lib/tokens/utils/getSignature";
import { transactionSenderAndConfirmationWaiter } from "@/lib/tokens/utils/transactionSender";
import { QuoteResponse } from "@jup-ag/api";
import { solToken } from "@/lib/tokens/utils/defaultTokens";
import { api } from "@/lib/trpc/api";
import { widgetsTx } from "@/lib/db/schema/transaction";

export const connection = new Connection(env.HELIUS_RPC_URL);

export const tradeToken = async (
  amountQuoteUrl: string,
  widgetId: string,
  sendTokenId: string,
  receiveTokenId: string
) => {
  try {
    const { session } = await getUserAuth();
    const { widget } = await api.widgets.getWidgetById.query({
      id: widgetId,
    });

    if (!widget) return { message: "No Widget found" };

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
      const fullFee = +quoteResponse.platformFee?.amount!;
      const platformFee = (fullFee * (100 - widget.feePercentage)) / 100;
      const remainingFee = (fullFee * widget.feePercentage) / 100;
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: feeWallet,
        lamports: platformFee,
      });
      const remainingFeeTx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: feeWallet,
        lamports: remainingFee,
      });
      message.instructions.push(solTransferInstruction, remainingFeeTx);
    } else {
      const fees = Math.ceil(+quoteResponse.inAmount / 100);
      const platformFee = (fees * (100 - widget.feePercentage)) / 100;
      const remainingFee = (fees * widget.feePercentage) / 100;
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: feeWallet,
        lamports: platformFee,
      });
      const remainingFeeTx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: feeWallet,
        lamports: remainingFee,
      });
      message.instructions.push(solTransferInstruction, remainingFeeTx);
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
    await db
      .insert(widgetsTx)
      .values({
        receiveTokenId,
        sendTokenId,
        widgetId: widget.id,
        userId: session?.user.id!,
        swapDetails: JSON.stringify(quoteResponse),
        tx: signature,
      })
      .returning();
    return { signature };
  } catch (err) {
    console.log(err);
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};
