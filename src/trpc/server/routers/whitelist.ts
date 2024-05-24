import { protectedProcedure, router } from "@/trpc/server";
import { campaignIdSchema } from "@/trpc/server/actions/campaign/campaign.types";
import {
  getWhiteListCampaignById,
  getWhitelistById,
  getWhitelists,
} from "@/trpc/server/actions/whitelist/whitelist.queries";
import {
  insertWhitelistParams,
  updateWhitelistParams,
  whitelistIdSchema,
} from "@/trpc/server/actions/whitelist/whitelist.type";
import {
  createWhitelist,
  deleteWhitelist,
  updateWhitelist,
} from "@/trpc/server/actions/whitelist/whitelist.mutations";

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
