import { protectedProcedure, router } from "@/lib/server/trpc";
import { tradeSchema } from "@/lib/db/schema/tokens";
import { tradeToken } from "@/lib/api/trade/mutations";

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
});
