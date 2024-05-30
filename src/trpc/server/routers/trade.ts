import { protectedProcedure, router } from "@/trpc/server";
import {
  sendSPLToken,
  sendSol,
  tradeToken,
} from "@/trpc/server/actions/trade/trade.mutations";
import {
  sendTokenSchema,
  tradeSchema,
} from "@/trpc/server/actions/trade/trade.type";

export const trade = router({
  tradeToken: protectedProcedure
    .input(tradeSchema)
    .mutation(async ({ input }) => {
      return tradeToken(
        input.quotedURL,
        input.widgetId,
        input.sendTokenId,
        input.receiveTokenId
      );
    }),
  sendSPLToken: protectedProcedure
    .input(sendTokenSchema)
    .mutation(async ({ input }) => {
      return sendSPLToken(
        input.sendAddress,
        input.sendAmount,
        input.tokenAddress
      );
    }),
  sendSol: protectedProcedure
    .input(sendTokenSchema)
    .mutation(async ({ input }) => {
      return sendSol(input.sendAddress, input.sendAmount, input.tokenAddress);
    }),
});
