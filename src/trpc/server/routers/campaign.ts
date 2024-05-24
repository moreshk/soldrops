import { protectedProcedure, router } from "@/trpc/server";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/trpc/server/actions/campaign/campaign.mutations";
import {
  getCampaignById,
  getCampaigns,
  getLiveCampaigns,
} from "@/trpc/server/actions/campaign/campaign.queries";
import {
  campaignIdSchema,
  insertCampaignParams,
  updateCampaignParams,
} from "@/trpc/server/actions/campaign/campaign.types";

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
