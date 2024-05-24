import { PublicKey } from "@solana/web3.js";
import { getATAAddressSync } from "@saberhq/token-utils";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { auth } from "@clerk/nextjs/server";
import { connection } from "@/utils/connection";
import { TokenId, tokenIdSchema } from "../tokens/tokens.type";

export const getSolTokenBalance = async () => {
  const { userId } = auth();
  try {
    const walletAddress = new PublicKey(userId!);
    const balance = await connection.getBalance(walletAddress);
    return { balance };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const getAllTokensBalance = async () => {
  const { userId } = auth();

  try {
    const accounts = await connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 32,
              bytes: userId!,
            },
          },
        ],
      }
    );
    return { accounts };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const getSwapTokenBalance = async (id: TokenId) => {
  const { sessionClaims } = auth().protect();
  const sessionWalletAddress = sessionClaims.walletAddress as string;
  try {
    const { id: tokenAddress } = tokenIdSchema.parse({ id });
    const walletAddress = new PublicKey(sessionWalletAddress);
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
