import { sql } from "drizzle-orm";
import {
  varchar,
  integer,
  timestamp,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core";
import { users } from "@/lib/db/schema/auth";
import { nanoid } from "@/lib/utils";

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
