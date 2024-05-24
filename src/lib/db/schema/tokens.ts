import { sql } from "drizzle-orm";
import {
  varchar,
  integer,
  boolean,
  timestamp,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./user";

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
