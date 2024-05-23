import { protectedProcedure, router } from "@/lib/trpc-server/trpc";
import {
  swapToken,
  swapTokenOutputFee,
} from "@/lib/trpc-api/swap/swap.mutations";
import { swapSchema } from "@/lib/trpc-api/swap/swap.type";

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
