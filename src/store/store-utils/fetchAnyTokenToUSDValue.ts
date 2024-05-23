import { CompleteToken } from "@/lib/trpc-api/tokens/tokens.type";

import { stableUSDC } from "@/utils/defaultTokens";
import { QuoteResponse } from "@jup-ag/api";

export const fetchAnyTokenToUSDValue = async (
  token: CompleteToken,
  tokenAmount: string
) => {
  if (+tokenAmount > 0 && stableUSDC.address !== token.address) {
    try {
      const amount = +tokenAmount * 10 ** token.decimal;
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${token.address}&outputMint=${stableUSDC.address}&amount=${amount}`;
      const response = await fetch(url);
      const quoteResponse: QuoteResponse = await response.json();
      return {
        success: true,
        amount: `${+quoteResponse.outAmount / 10 ** stableUSDC.decimal}`,
      };
    } catch (e) {
      return {
        success: false,
        message: "error fetching token value",
        amount: "0",
      };
    }
  }
  return { amount: `${+tokenAmount}`, success: true };
};
