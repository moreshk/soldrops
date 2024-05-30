import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { whitelist } from "@/lib/db/schema/whitelist";
import {
  WhitelistId,
  NewWhitelistParams,
  UpdateWhitelistParams,
  insertWhitelistSchema,
  whitelistIdSchema,
  updateWhitelistParams,
} from "./whitelist.type";
import { novu } from "@/lib/novu/novu";
import { auth } from "@clerk/nextjs/server";

export const createWhitelist = async (whitelistData: NewWhitelistParams) => {
  const { userId } = auth().protect();
  const newWhitelist = insertWhitelistSchema.parse({
    ...whitelistData,
    userId: userId!,
  });
  try {
    const [w] = await db.insert(whitelist).values(newWhitelist).returning();
    return { whitelist: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateWhitelist = async (
  id: WhitelistId,
  whitelistData: UpdateWhitelistParams
) => {
  const { userId } = auth().protect();
  const { id: whitelistId } = whitelistIdSchema.parse({ id });
  const newWhitelist = updateWhitelistParams.parse({
    ...whitelistData,
    userId: userId,
  });
  try {
    const [w] = await db
      .update(whitelist)
      .set({ ...newWhitelist, updatedAt: new Date() })
      .where(and(eq(whitelist.id, whitelistId!), eq(whitelist.userId, userId!)))
      .returning();
    if (w.whitelisted) {
      await novu.topics.addSubscribers(w.campaignId, {
        subscribers: [userId!],
      });
    }
    return { whitelist: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteWhitelist = async (id: WhitelistId) => {
  const { userId } = auth().protect();
  const { id: whitelistId } = whitelistIdSchema.parse({ id });
  try {
    const [w] = await db
      .delete(whitelist)
      .where(and(eq(whitelist.id, whitelistId!), eq(whitelist.userId, userId!)))
      .returning();
    return { whitelist: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
