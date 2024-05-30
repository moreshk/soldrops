import { TokenPrice } from "@/trpc/server/actions/token-balance/token-balance.type";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { TypeWalletTokenDetails } from "./WalletDetails";
import { solToken } from "@/utils/defaultTokens";

export const TotalWalletBalance = ({
  accounts,
  solBalance,
  tokenPrice,
  tokens,
}: {
  accounts: TypeWalletTokenDetails[];
  solBalance: number;
  tokenPrice: TokenPrice;
  tokens: CompleteToken[];
}) => {
  const balance = useMemo(() => {
    const allWalletTokenDetails: {
      [key: string]: TypeWalletTokenDetails;
    } = {};
    accounts.forEach((value) => {
      const info = value.account.data.parsed.info;
      allWalletTokenDetails[info.mint] = value;
    });
    const amount = tokens.reduce(
      (accumulator: number, currentToken: CompleteToken) => {
        const walletTokenDetails = allWalletTokenDetails[currentToken.address];
        const tokenPriceDetails = tokenPrice[currentToken.address]?.value;
        if (walletTokenDetails) {
          const info = walletTokenDetails.account.data.parsed.info;
          const usdValue = +info.tokenAmount.uiAmountString * tokenPriceDetails;
          return +accumulator + usdValue;
        } else {
          return accumulator;
        }
      },
      0
    );
    const solAmount = tokenPrice[solToken.address].value * solBalance;
    return amount + solAmount;
  }, [accounts, solBalance, tokenPrice, tokens]);

  return (
    <p className="text-center text-4xl font-semibold pt-4 pb-7">
      ${balance.toFixed(2)}
    </p>
  );
};
