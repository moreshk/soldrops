import { protectedProcedure, router } from "@/lib/trpc-server/trpc";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/lib/trpc-api/campaign/campaign.mutations";
import {
  getCampaignById,
  getCampaigns,
  getLiveCampaigns,
} from "@/lib/trpc-api/campaign/campaign.queries";
import {
  campaignIdSchema,
  insertCampaignParams,
  updateCampaignParams,
} from "@/lib/trpc-api/campaign/campaign.types";

export const campaignRouter = router({
  getCampaigns: protectedProcedure.query(async () => {
    return getCampaigns();
  }),
  getCampaignById: protectedProcedure
    .input(campaignIdSchema)
    .query(async ({ input }) => {
      return getCampaignById(input.id);
    }),
  createCampaign: protectedProcedure
    .input(insertCampaignParams)
    .mutation(async ({ input }) => {
      return createCampaign(input);
    }),
  updateCampaign: protectedProcedure
    .input(updateCampaignParams)
    .mutation(async ({ input }) => {
      return updateCampaign(input.id, input);
    }),
  deleteCampaign: protectedProcedure
    .input(campaignIdSchema)
    .mutation(async ({ input }) => {
      return deleteCampaign(input.id);
    }),
  getLiveCampaigns: protectedProcedure.query(() => {
    return getLiveCampaigns();
  }),
});
