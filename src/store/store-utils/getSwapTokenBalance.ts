import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";
import { solToken } from "@/utils/defaultTokens";

export const getSwapTokenBalance = async (
  sendToken: CompleteToken,
  receiveToken: CompleteToken
) => {
  try {
    const isSendSolTokenAddress = sendToken.address === solToken.address;
    const isReceiveSolTokenAddress = receiveToken.address === solToken.address;
    const splTokenAddress = isSendSolTokenAddress
      ? receiveToken.address
      : sendToken.address;
    const { ataTokenBalance, solBalance } =
      await window.trpc.tokenBalance.getSwapTokenBalance.query({
        id: splTokenAddress,
      });

    const sendTokenBalance = isSendSolTokenAddress
      ? `${solBalance / Math.pow(10, solToken.decimal)}`
      : `${+ataTokenBalance}`;
    const receiveTokenBalance = isReceiveSolTokenAddress
      ? `${solBalance / Math.pow(10, receiveToken.decimal)}`
      : `${+ataTokenBalance}`;

    return {
      success: true,
      sendTokenBalance,
      receiveTokenBalance,
    };
  } catch (e) {
    return { success: false, receiveTokenBalance: `0`, sendTokenBalance: `0` };
  }
};
