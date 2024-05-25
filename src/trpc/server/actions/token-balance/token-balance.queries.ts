import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { getATAAddressSync } from "@saberhq/token-utils";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { auth } from "@clerk/nextjs/server";
import { connection } from "@/utils/connection";
import { TokenId, tokenIdSchema } from "../tokens/tokens.type";
import { TokenPrice } from "./token-balance.type";
import { solToken } from "@/utils/defaultTokens";

export const getSolTokenBalance = async () => {
  const { sessionClaims } = auth().protect();
  if (sessionClaims.walletAddress) {
    try {
      const walletAddress = new PublicKey(
        sessionClaims.walletAddress as string
      );
      const balance = await connection.getBalance(walletAddress);
      return { balance };
    } catch (err) {
      const message = (err as Error).message ?? "Error, please try again";
      console.error(message);
      throw { message };
    }
  }
  return { balance: 0 };
};

export const getAllTokensBalance = async () => {
  const { sessionClaims } = auth().protect();
  let accounts: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData | Buffer>;
  }[] = [];

  try {
    accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 32,
            bytes: sessionClaims.walletAddress as string,
          },
        },
      ],
    });
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
  }
  try {
    const allAccounts = accounts
      .map((token) => {
        const data = token.account.data as ParsedAccountData;
        const address = data.parsed.info.mint;
        return address;
      })
      .join(",");
    const balance =
      (await connection.getBalance(
        new PublicKey(sessionClaims.walletAddress as string)
      )) /
      10 ** solToken.decimal;

    const response = await fetch(
      "https://public-api.birdeye.so/defi/multi_price",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-API-KEY": "6b234866de0740509b9c0eef83e97119",
        },
        body: JSON.stringify({
          list_address: `So11111111111111111111111111111111111111112,mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So,${allAccounts}`,
        }),
      }
    );
    {
    }
    const { data } = (await response.json()) as {
      data: TokenPrice;
      success: boolean;
    };

    return { accounts, tokenPrice: data, balance };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
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
