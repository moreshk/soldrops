import {
  AddressLookupTableAccount,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import fetch from "cross-fetch";
import bs58 from "bs58";
import { env } from "@/lib/env.mjs";
import CryptoJS from "crypto-js";
import { getSignature } from "@/utils/getSignature";
import { transactionSenderAndConfirmationWaiter } from "@/utils/transactionSender";
import { QuoteResponse } from "@jup-ag/api";
import { getFeeAddress } from "@/utils/getFeeAddress";
import { solToken } from "@/utils/defaultTokens";
// @ts-ignore
import { TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { connection } from "@/utils/connection";

export const swapTokenOutputFee = async (amountQuoteUrl: string) => {
  try {
    const { userId } = auth();
    const user = await clerkClient.users.getUser(userId! as string);
    const hashedPrivatekey = user.privateMetadata.privateKey as string;
    if (!hashedPrivatekey) throw { message: "something went wrong" };
    const walletAddress = user.privateMetadata.walletAddress;
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
          userPublicKey: walletAddress,
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
    const { userId } = auth().protect();
    const user = await clerkClient.users.getUser(userId);
    const hashedPrivatekey = user.privateMetadata.privateKey as string;
    if (!hashedPrivatekey) throw { message: "something went wrong" };
    const walletAddress = user.privateMetadata.walletAddress;
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
          userPublicKey: walletAddress,
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
      const fees = Math.ceil(+quoteResponse.inAmount / 100);
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
