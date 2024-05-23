import { relations, sql } from "drizzle-orm";
import { varchar, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getWidgets } from "@/lib/api/widgets/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { tokens } from "./tokens";

export const widgets = pgTable("widgets", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => `pk_${nanoid()}`),
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

// Schema for widgets - used to validate API requests
const baseSchema = createSelectSchema(widgets).omit(timestamps);

export const insertWidgetSchema = createInsertSchema(widgets).omit(timestamps);
export const insertWidgetParams = baseSchema
  .extend({
    feeWalletAddress: z.string().min(12, "Please Add Fee wallet"),
    tokenId: z.string().min(12, "Please select token"),
  })
  .omit({
    id: true,
    userId: true,
    feePercentage: true,
  });

export const updateWidgetSchema = baseSchema.omit({
  userId: true,
  feePercentage: true,
});
export const updateWidgetParams = baseSchema
  .extend({
    feeWalletAddress: z.string().min(12, "Please Add Fee wallet"),
    tokenId: z.string().min(12, "Please select token"),
  })
  .omit({
    userId: true,
    feePercentage: true,
  });
export const widgetIdSchema = baseSchema.pick({ id: true });

// Types for widgets - used to type API request params and within Components
export type Widget = typeof widgets.$inferSelect;
export type NewWidget = z.infer<typeof insertWidgetSchema>;
export type NewWidgetParams = z.infer<typeof insertWidgetParams>;
export type UpdateWidgetParams = z.infer<typeof updateWidgetParams>;
export type WidgetId = z.infer<typeof widgetIdSchema>["id"];

// this type infers the return from getWidgets() - meaning it will include any joins
export type CompleteWidget = Awaited<
  ReturnType<typeof getWidgets>
>["widgets"][number];
