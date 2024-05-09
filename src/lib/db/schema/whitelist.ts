import { relations, sql } from "drizzle-orm";
import { boolean, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { campaign } from "@/lib/db/schema/campaign";

import { nanoid, timestamps } from "@/lib/utils";

export const whitelist = pgTable("whitelist", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  followTwitter: boolean("follow_twitter").notNull().default(false),
  retweetAnnouncement: boolean("retweet_announcement").notNull().default(false),
  whitelisted: boolean("whitelisted").notNull().default(false),
  userId: varchar("user_id", { length: 256 })
    .references(() => users.id)
    .notNull(),
  campaignId: varchar("campaign_id", { length: 256 })
    .references(() => campaign.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const whiteListRelation = relations(whitelist, ({ one }) => ({
  userDetails: one(users, {
    fields: [whitelist.userId],
    references: [users.id],
  }),
  campaignDetails: one(campaign, {
    fields: [whitelist.campaignId],
    references: [campaign.id],
  }),
}));

const baseSchema = createSelectSchema(whitelist).omit(timestamps);

export const insertWhitelistSchema =
  createInsertSchema(whitelist).omit(timestamps);
export const insertWhitelistParams = baseSchema
  .extend({
    followTwitter: z.coerce.boolean().optional(),
    retweetAnnouncement: z.coerce.boolean().optional(),
    whitelisted: z.coerce.boolean().optional(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateWhitelistSchema = baseSchema;
export const updateWhitelistParams = baseSchema
  .extend({
    followTwitter: z.coerce.boolean().optional(),
    retweetAnnouncement: z.coerce.boolean().optional(),
    whitelisted: z.coerce.boolean().optional(),
  })
  .omit({
    userId: true,
    campaignId: true,
  });
export const whitelistIdSchema = baseSchema.pick({ id: true });

// Types for whitelist - used to type API request params and within Components
export type Whitelist = typeof whitelist.$inferSelect;
export type NewWhitelist = z.infer<typeof insertWhitelistSchema>;
export type NewWhitelistParams = z.infer<typeof insertWhitelistParams>;
export type UpdateWhitelistParams = z.infer<typeof updateWhitelistParams>;
export type WhitelistId = z.infer<typeof whitelistIdSchema>["id"];
