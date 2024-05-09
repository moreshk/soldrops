import { sql } from "drizzle-orm";
import {
  varchar,
  integer,
  timestamp,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getCampaigns } from "@/lib/api/campaign/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const campaign = pgTable("campaign", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  tokenContractAddress: varchar("token_contract_address", {
    length: 256,
  }).notNull(),
  tokenSymbol: varchar("token_symbol", { length: 256 }).notNull(),
  tokenImage: varchar("token_image", { length: 256 }).notNull(),
  tokenDecimal: integer("token_decimal").notNull(),
  totalTokenDrop: integer("total_token_drop").notNull(),
  totalWalletNumber: integer("total_wallet_number").notNull(),
  twitterHandel: varchar("twitter_handel", { length: 256 }),
  announcementTweet: varchar("announcement_tweet", { length: 256 }),
  startDate: timestamp("start_data", { mode: "date" }).notNull(),
  endDate: timestamp("end_Date", { mode: "date" }).notNull(),
  visibilityStatus: boolean("visibility_status").notNull().default(true),
  isCampaignEnded: boolean("is_campaign_ended").notNull().default(false),
  transactionHash: varchar("transaction_hash", { length: 256 }),
  canCampaignUpdate: boolean("can_campaign_update").notNull().default(true),
  userId: varchar("user_id", { length: 256 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

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
