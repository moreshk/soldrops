import { protectedProcedure, router } from "@/trpc/server";
import {
  getATATokenBalance,
  getAllTokensBalance,
  getSolTokenBalance,
  getSwapTokenBalance,
} from "@/trpc/server/actions/token-balance/token-balance.queries";
import { tokenIdSchema } from "@/trpc/server/actions/tokens/tokens.type";

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
