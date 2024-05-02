import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  WhitelistId,
  NewWhitelistParams,
  UpdateWhitelistParams,
  insertWhitelistSchema,
  whitelist,
  whitelistIdSchema,
  updateWhitelistParams,
} from "@/lib/db/schema/whitelist";
import { getUserAuth } from "@/lib/auth/utils";
import { novu } from "@/lib/novu/novu";

export const createWhitelist = async (whitelistData: NewWhitelistParams) => {
  const { session } = await getUserAuth();
  const newWhitelist = insertWhitelistSchema.parse({
    ...whitelistData,
    userId: session?.user.id!,
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
  const { session } = await getUserAuth();
  const { id: whitelistId } = whitelistIdSchema.parse({ id });
  const newWhitelist = updateWhitelistParams.parse({
    ...whitelistData,
    userId: session?.user.id!,
  });
  try {
    const [w] = await db
      .update(whitelist)
      .set({ ...newWhitelist, updatedAt: new Date() })
      .where(
        and(
          eq(whitelist.id, whitelistId!),
          eq(whitelist.userId, session?.user.id!)
        )
      )
      .returning();
    if (w.whitelisted) {
      await novu.topics.addSubscribers(w.campaignId, {
        subscribers: [session?.user.id!],
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
  const { session } = await getUserAuth();
  const { id: whitelistId } = whitelistIdSchema.parse({ id });
  try {
    const [w] = await db
      .delete(whitelist)
      .where(
        and(
          eq(whitelist.id, whitelistId!),
          eq(whitelist.userId, session?.user.id!)
        )
      )
      .returning();
    return { whitelist: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
