import {
  getAllTokens,
  getSolTokenBalance,
  getTokenById,
  getTokens,
  getATATokenBalance,
  getSwapTokenBalance,
  getAllTokensBalance,
} from "@/lib/api/tokens/queries";
import { protectedProcedure, publicProcedure, router } from "@/lib/server/trpc";
import {
  tokenIdSchema,
  insertTokenParams,
  updateTokenParams,
  swapSchema,
} from "@/lib/db/schema/tokens";
import {
  createToken,
  deleteToken,
  swapToken,
  swapTokenOutputFee,
  updateToken,
} from "@/lib/api/tokens/mutations";

export const tokensRouter = router({
  getTokens: publicProcedure.query(async () => {
    return getTokens();
  }),
  getAllTokens: publicProcedure.query(async () => {
    return getAllTokens();
  }),
  getTokenById: publicProcedure
    .input(tokenIdSchema)
    .query(async ({ input }) => {
      return getTokenById(input.id);
    }),
  createToken: publicProcedure
    .input(insertTokenParams)
    .mutation(async ({ input }) => {
      return createToken(input);
    }),
  updateToken: publicProcedure
    .input(updateTokenParams)
    .mutation(async ({ input }) => {
      return updateToken(input.id, input);
    }),
  deleteToken: publicProcedure
    .input(tokenIdSchema)
    .mutation(async ({ input }) => {
      return deleteToken(input.id);
    }),
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
  swapToken: protectedProcedure
    .input(swapSchema)
    .mutation(async ({ input }) => {
      return swapToken(input.quotedURL);
    }),
  swapTokenOutputFee: protectedProcedure
    .input(swapSchema)
    .mutation(async ({ input }) => {
      return swapTokenOutputFee(input.quotedURL);
    }),
});
