import { relations, sql } from "drizzle-orm";
import { varchar, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { users } from "@/lib/db/schema/auth";
import { nanoid } from "@/lib/utils";
import { tokens } from "./tokens";

export const widgets = pgTable("widgets", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => `wget_${nanoid()}`),
  feeWalletAddress: varchar("fee_wallet_address", { length: 256 }).notNull(),
  feePercentage: integer("fee_percentage").default(30).notNull(),
  tokenId: varchar("token_id", { length: 256 })
    .references(() => tokens.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 256 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const widgetsRelations = relations(widgets, ({ one }) => ({
  token: one(tokens, {
    fields: [widgets.tokenId],
    references: [tokens.id],
  }),
}));
