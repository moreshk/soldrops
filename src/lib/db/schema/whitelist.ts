import { relations, sql } from "drizzle-orm";
import { boolean, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { users } from "@/lib/db/schema/auth";
import { campaign } from "@/lib/db/schema/campaign";

import { nanoid } from "@/lib/utils";

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
