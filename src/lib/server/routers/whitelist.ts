import {
  getWhiteListCampaignById,
  getWhitelistById,
  getWhitelists,
} from "@/lib/api/whitelist/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  whitelistIdSchema,
  insertWhitelistParams,
  updateWhitelistParams,
} from "@/lib/db/schema/whitelist";
import {
  createWhitelist,
  deleteWhitelist,
  updateWhitelist,
} from "@/lib/api/whitelist/mutations";
import { campaignIdSchema } from "@/lib/db/schema/campaign";

export const whitelistRouter = router({
  getWhitelist: publicProcedure.query(async () => {
    return getWhitelists();
  }),
  getWhitelistById: publicProcedure
    .input(whitelistIdSchema)
    .query(async ({ input }) => {
      return getWhitelistById(input.id);
    }),
  createWhitelist: publicProcedure
    .input(insertWhitelistParams)
    .mutation(async ({ input }) => {
      return createWhitelist(input);
    }),
  updateWhitelist: publicProcedure
    .input(updateWhitelistParams)
    .mutation(async ({ input }) => {
      return updateWhitelist(input.id, input);
    }),
  deleteWhitelist: publicProcedure
    .input(whitelistIdSchema)
    .mutation(async ({ input }) => {
      return deleteWhitelist(input.id);
    }),
  getWhiteListCampaignById: publicProcedure
    .input(campaignIdSchema)
    .query(({ input }) => {
      return getWhiteListCampaignById(input.id);
    }),
});
