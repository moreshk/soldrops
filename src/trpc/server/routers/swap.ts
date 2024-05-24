import { protectedProcedure, router } from "@/trpc/server";
import {
  swapToken,
  swapTokenOutputFee,
} from "@/trpc/server/actions/swap/swap.mutations";
import { swapSchema } from "@/trpc/server/actions/swap/swap.type";

export const swapRouter = router({
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
