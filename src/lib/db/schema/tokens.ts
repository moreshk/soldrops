import { sql } from "drizzle-orm";
import {
  varchar,
  integer,
  boolean,
  timestamp,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getTokens } from "@/lib/api/tokens/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const tokens = pgTable("tokens", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  symbol: varchar("symbol", { length: 256 }).notNull(),
  imageUrl: varchar("image_url", { length: 256 }).notNull(),
  description: text("description").notNull(),
  decimal: integer("decimal").notNull(),
  listing: boolean("listing").notNull().default(false),
  address: varchar("address", { length: 256 }).notNull(),
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

// Schema for tokens - used to validate API requests
const baseSchema = createSelectSchema(tokens).omit(timestamps);

export const insertTokenSchema = createInsertSchema(tokens).omit(timestamps);
export const insertTokenParams = baseSchema
  .extend({
    decimal: z.coerce.number(),
    listing: z.coerce.boolean(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateTokenSchema = baseSchema;
export const updateTokenParams = baseSchema
  .extend({
    decimal: z.coerce.number(),
    listing: z.coerce.boolean(),
  })
  .omit({
    userId: true,
  });
export const tokenIdSchema = baseSchema.pick({ id: true });

export const swapSchema = z.object({
  quotedURL: z.string(),
});
export const tradeSchema = z.object({
  quotedURL: z.string().url(),
  widgetId: z.string().min(5, "Invalid widgetId"),
  sendTokenId: z.string().min(5, "Invalid"),
  receiveTokenId: z.string().min(5, "Invalid"),
});

// Types for tokens - used to type API request params and within Components
export type Token = typeof tokens.$inferSelect;
export type NewToken = z.infer<typeof insertTokenSchema>;
export type NewTokenParams = z.infer<typeof insertTokenParams>;
export type UpdateTokenParams = z.infer<typeof updateTokenParams>;
export type TokenId = z.infer<typeof tokenIdSchema>["id"];

// this type infers the return from getTokens() - meaning it will include any joins
export type CompleteToken = Awaited<
  ReturnType<typeof getTokens>
>["tokens"][number];

export const tokenData = z.object({
  tokenAddress: z.string(),
});
