import { protectedProcedure, router } from "@/lib/trpc-server/trpc";
import {
  getATATokenBalance,
  getAllTokensBalance,
  getSolTokenBalance,
  getSwapTokenBalance,
} from "@/lib/trpc-api/token-balance/token-balance.queries";
import { tokenIdSchema } from "@/lib/trpc-api/tokens/tokens.type";

export const tokenBalanceRouter = router({
  getSolTokenBalance: protectedProcedure.query(async () => {
    return getSolTokenBalance();
  }),
  getAllTokensBalance: protectedProcedure.query(async () => {
    return getAllTokensBalance();
  }),
  getATATokenBalance: protectedProcedure
    .input(tokenIdSchema)
    .query(async ({ input }) => {
      return getATATokenBalance(input.id);
    }),
  getSwapTokenBalance: protectedProcedure
    .input(tokenIdSchema)
    .query(async ({ input }) => {
      return getSwapTokenBalance(input.id);
    }),
});
