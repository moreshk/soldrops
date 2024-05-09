import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { nanoid } from "@/lib/utils";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name"),
  email: text("email"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  username: text("user_name"),
  isAdmin: boolean("isAdmin").default(false),
  userType: text("user_type").default("user"),
  defaultURL: text("default_url").default("/dashboard"),
  walletAddress: text("wallet_address").notNull().unique(),
  privateKey: text("private_key").notNull().unique(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
