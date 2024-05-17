import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.mjs";
import * as auth from "./schema/auth";
import * as campaign from "./schema/campaign";
import * as whitelist from "./schema/whitelist";
import * as token from "./schema/tokens";
import * as widgets from "./schema/widgets";
import * as tx from "./schema/transaction";

export const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, {
  schema: { ...auth, ...campaign, ...whitelist, ...widgets, ...token, ...tx },
});
