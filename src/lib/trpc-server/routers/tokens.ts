import {
  getAllTokens,
  getTokenById,
  getUsersTokens,
} from "@/lib/trpc-api/tokens/tokens.queries";
import {
  protectedProcedure,
  publicProcedure,
  router,
} from "@/lib/trpc-server/trpc";
import {
  createToken,
  deleteToken,
  updateToken,
} from "@/lib/trpc-api/tokens/tokens.mutations";
import {
  insertTokenParams,
  tokenIdSchema,
  updateTokenParams,
} from "@/lib/trpc-api/tokens/tokens.type";

export const tokensRouter = router({
  getUsersTokens: protectedProcedure.query(async () => {
    return getUsersTokens();
  }),
  getAllTokens: publicProcedure.query(async () => {
    return getAllTokens();
  }),
  getTokenById: protectedProcedure
    .input(tokenIdSchema)
    .query(async ({ input }) => {
      return getTokenById(input.id);
    }),
  createToken: protectedProcedure
    .input(insertTokenParams)
    .mutation(async ({ input }) => {
      return createToken(input);
    }),
  updateToken: protectedProcedure
    .input(updateTokenParams)
    .mutation(async ({ input }) => {
      return updateToken(input.id, input);
    }),
  deleteToken: protectedProcedure
    .input(tokenIdSchema)
    .mutation(async ({ input }) => {
      return deleteToken(input.id);
    }),
});
