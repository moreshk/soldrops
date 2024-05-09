import { getTokenById, getTokens } from "@/lib/api/tokens/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  tokenIdSchema,
  insertTokenParams,
  updateTokenParams,
} from "@/lib/db/schema/tokens";
import { createToken, deleteToken, updateToken } from "@/lib/api/tokens/mutations";

export const tokensRouter = router({
  getTokens: publicProcedure.query(async () => {
    return getTokens();
  }),
  getTokenById: publicProcedure.input(tokenIdSchema).query(async ({ input }) => {
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
});
