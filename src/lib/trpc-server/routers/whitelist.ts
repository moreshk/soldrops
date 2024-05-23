import { protectedProcedure, router } from "@/lib/trpc-server/trpc";
import { campaignIdSchema } from "@/lib/trpc-api/campaign/campaign.types";
import {
  getWhiteListCampaignById,
  getWhitelistById,
  getWhitelists,
} from "@/lib/trpc-api/whitelist/whitelist.queries";
import {
  insertWhitelistParams,
  updateWhitelistParams,
  whitelistIdSchema,
} from "@/lib/trpc-api/whitelist/whitelist.type";
import {
  createWhitelist,
  deleteWhitelist,
  updateWhitelist,
} from "@/lib/trpc-api/whitelist/whitelist.mutations";

export const whitelistRouter = router({
  getWhitelist: protectedProcedure.query(async () => {
    return getWhitelists();
  }),
  getWhitelistById: protectedProcedure
    .input(whitelistIdSchema)
    .query(async ({ input }) => {
      return getWhitelistById(input.id);
    }),
  createWhitelist: protectedProcedure
    .input(insertWhitelistParams)
    .mutation(async ({ input }) => {
      return createWhitelist(input);
    }),
  updateWhitelist: protectedProcedure
    .input(updateWhitelistParams)
    .mutation(async ({ input }) => {
      return updateWhitelist(input.id, input);
    }),
  deleteWhitelist: protectedProcedure
    .input(whitelistIdSchema)
    .mutation(async ({ input }) => {
      return deleteWhitelist(input.id);
    }),
  getWhiteListCampaignById: protectedProcedure
    .input(campaignIdSchema)
    .query(({ input }) => {
      return getWhiteListCampaignById(input.id);
    }),
});
