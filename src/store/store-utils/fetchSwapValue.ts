import { CompleteToken } from "@/lib/db/schema/tokens";
import { solToken } from "@/lib/tokens/utils/defaultTokens";
import { QuoteResponse } from "@jup-ag/api";

export const fetchSwapValue = async (
  sendToken: CompleteToken,
  receiveToken: CompleteToken,
  tokenAmount: string
) => {
  if (+tokenAmount > 0) {
    try {
      const amount = +tokenAmount * 10 ** sendToken.decimal;
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${sendToken.address}&outputMint=${receiveToken.address}&amount=${amount}&platformFeeBps=100&slippageBps=500`;
      const response = await fetch(url);
      const quoteResponse: QuoteResponse = await response.json();
      if (receiveToken.address === solToken.address) {
        return {
          success: true,
          amount: `${+quoteResponse.outAmount / 10 ** receiveToken.decimal}`,
        };
      } else {
        return {
          success: true,
          amount: `${+quoteResponse.outAmount / 10 ** receiveToken.decimal}`,
        };
      }
    } catch (e) {
      return {
        success: false,
        message: "error fetching token value",
        amount: "0",
      };
    }
  }
  return { amount: (+tokenAmount).toFixed(2), success: true };
};
