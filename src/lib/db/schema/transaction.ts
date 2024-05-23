import { relations, sql } from "drizzle-orm";
import { varchar, timestamp, pgTable, text } from "drizzle-orm/pg-core";

import { users } from "@/lib/db/schema/auth";

import { nanoid } from "@/lib/utils";
import { tokens } from "./tokens";
import { widgets } from "./widgets";

export const widgetsTx = pgTable("widgets_tx", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  tx: text("tx").notNull(),
  swapDetails: text("swap_details").notNull(),
  widgetId: varchar("widget_id")
    .references(() => widgets.id, { onDelete: "cascade" })
    .notNull(),
  sendTokenId: varchar("send_token_id")
    .references(() => tokens.id, { onDelete: "cascade" })
    .notNull(),
  receiveTokenId: varchar("receive_token_id")
    .references(() => tokens.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const widgetsTxRelation = relations(widgetsTx, ({ one }) => ({
  sendToken: one(tokens, {
    fields: [widgetsTx.sendTokenId],
    references: [tokens.id],
  }),
  widget: one(widgets, {
    fields: [widgetsTx.widgetId],
    references: [widgets.id],
  }),
  receiveToken: one(tokens, {
    fields: [widgetsTx.receiveTokenId],
    references: [tokens.id],
  }),
}));
