import { protectedProcedure, router } from "@/lib/server/trpc";
import { sendTokenSchema, tradeSchema } from "@/lib/db/schema/tokens";
import { sendSPLToken, sendSol, tradeToken } from "@/lib/api/trade/mutations";

export const tradeRouter = router({
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
