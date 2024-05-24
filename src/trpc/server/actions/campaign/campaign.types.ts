import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { campaign } from "@/lib/db/schema/campaign";
import { getCampaigns } from "./campaign.queries";

const baseSchema = createSelectSchema(campaign).omit(timestamps);

export const insertCampaignSchema =
  createInsertSchema(campaign).omit(timestamps);
export const insertCampaignParams = baseSchema
  .extend({
    totalTokenDrop: z.coerce.number().gte(1),
    totalWalletNumber: z.coerce.number().gte(1),
    tokenDecimal: z.coerce.number(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    twitterHandel: z.coerce?.string(),
    announcementTweet: z.coerce?.string(),
    transactionHash: z.coerce?.string(),
    tokenContractAddress: z.coerce.string().nonempty(),
    tokenSymbol: z.coerce.string().nonempty(),
    tokenImage: z.coerce.string().nonempty(),
  })
  .omit({
    id: true,
    userId: true,
    isCampaignEnded: true,
    canCampaignUpdate: true,
    visibilityStatus: true,
  });

export const updateCampaignSchema = baseSchema;
export const updateCampaignParams = baseSchema
  .extend({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    twitterHandel: z.coerce?.string(),
    announcementTweet: z.coerce?.string(),
  })
  .omit({
    tokenDecimal: true,
    totalWalletNumber: true,
    totalTokenDrop: true,
    transactionHash: true,
    userId: true,
    isCampaignEnded: true,
    canCampaignUpdate: true,
    visibilityStatus: true,
    tokenContractAddress: true,
    tokenSymbol: true,
    tokenImage: true,
  });
export const campaignIdSchema = baseSchema.pick({ id: true });

// Types for campaign - used to type API request params and within Components
export type Campaign = typeof campaign.$inferSelect;
export type NewCampaign = z.infer<typeof insertCampaignSchema>;
export type NewCampaignParams = z.infer<typeof insertCampaignParams>;
export type UpdateCampaignParams = z.infer<typeof updateCampaignParams>;
export type CampaignId = z.infer<typeof campaignIdSchema>["id"];

// this type infers the return from getCampaign() - meaning it will include any joins
export type CompleteCampaign = Awaited<
  ReturnType<typeof getCampaigns>
>["campaign"][number];
