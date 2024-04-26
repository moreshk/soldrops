import {
  getCampaignById,
  getCampaigns,
  getLiveCampaigns,
} from "@/lib/api/campaign/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  campaignIdSchema,
  insertCampaignParams,
  updateCampaignParams,
} from "@/lib/db/schema/campaign";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/lib/api/campaign/mutations";

export const campaignRouter = router({
  getCampaigns: publicProcedure.query(async () => {
    return getCampaigns();
  }),
  getCampaignById: publicProcedure
    .input(campaignIdSchema)
    .query(async ({ input }) => {
      return getCampaignById(input.id);
    }),
  createCampaign: publicProcedure
    .input(insertCampaignParams)
    .mutation(async ({ input }) => {
      return createCampaign(input);
    }),
  updateCampaign: publicProcedure
    .input(updateCampaignParams)
    .mutation(async ({ input }) => {
      return updateCampaign(input.id, input);
    }),
  deleteCampaign: publicProcedure
    .input(campaignIdSchema)
    .mutation(async ({ input }) => {
      return deleteCampaign(input.id);
    }),
  getLiveCampaigns: publicProcedure.query(() => {
    return getLiveCampaigns();
  }),
});
