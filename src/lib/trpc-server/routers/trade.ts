import { protectedProcedure, router } from "@/lib/trpc-server/trpc";
import {
  sendSPLToken,
  sendSol,
  tradeToken,
} from "@/lib/trpc-api/trade/trade.mutations";
import { sendTokenSchema, tradeSchema } from "@/lib/trpc-api/trade/trade.type";

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
