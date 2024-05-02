import {
  getCampaignById,
  getCampaigns,
  getLiveCampaigns,
} from "@/lib/api/campaign/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  campaignIdSchema,
  updateCampaignParams,
} from "@/lib/db/schema/campaign";
import { updateCampaign } from "@/lib/api/campaign/mutations";
import { userWalletSchema } from "@/lib/db/schema/auth";
import { updateUserWallet } from "@/lib/api/auth/mutations";

export const authRouter = router({
  updateUserWallet: publicProcedure
    .input(userWalletSchema)
    .mutation(async ({ input }) => {
      return updateUserWallet(input.walletAddress);
    }),
});
