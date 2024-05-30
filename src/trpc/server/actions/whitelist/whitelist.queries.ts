import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { whitelist } from "@/lib/db/schema/whitelist";
import { createWhitelist } from "./whitelist.mutations";
import { auth } from "@clerk/nextjs/server";
import { WhitelistId, whitelistIdSchema } from "./whitelist.type";
import { CampaignId, campaignIdSchema } from "../campaign/campaign.types";

export const getWhitelists = async () => {
  const { userId } = auth().protect();
  const rows = await db.query.whitelist.findMany({
    where: and(eq(whitelist.userId, userId!), eq(whitelist.whitelisted, true)),
    with: {
      campaignDetails: true,
    },
  });
  return { whitelist: rows };
};

export const getWhitelistById = async (id: WhitelistId) => {
  const { userId } = auth().protect();

  const { id: whitelistId } = whitelistIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(whitelist)
    .where(and(eq(whitelist.id, whitelistId), eq(whitelist.userId, userId!)));
  if (row === undefined) return {};
  const w = row;
  return { whitelist: w };
};

export const getWhiteListCampaignById = async (id: CampaignId) => {
  const { userId } = auth().protect();

  const { id: campaignId } = campaignIdSchema.parse({ id });
  const c = await db.query.whitelist.findFirst({
    where: and(
      eq(whitelist.campaignId, campaignId),
      eq(whitelist.userId, userId!)
    ),
    with: {
      campaignDetails: true,
      userDetails: true,
    },
  });
  if (!c) {
    await createWhitelist({
      campaignId: campaignId,
    });
    const c = await db.query.whitelist.findFirst({
      where: and(
        eq(whitelist.campaignId, campaignId),
        eq(whitelist.userId, userId!)
      ),
      with: {
        campaignDetails: true,
        userDetails: true,
      },
    });
    return { whiteList: c };
  }
  return { whiteList: c };
};
