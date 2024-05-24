import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { campaign } from "@/lib/db/schema/campaign";
import { auth } from "@clerk/nextjs/server";
import { CampaignId, campaignIdSchema } from "./campaign.types";

export const getCampaigns = async () => {
  const { userId } = auth();
  const rows = await db
    .select()
    .from(campaign)
    .where(eq(campaign.userId, userId!));
  const c = rows;
  return { campaign: c };
};

export const getLiveCampaigns = async () => {
  const rows = await db.select().from(campaign);
  const c = rows;
  return { campaign: c };
};

export const getCampaignById = async (id: CampaignId) => {
  const { id: campaignId } = campaignIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(campaign)
    .where(and(eq(campaign.id, campaignId)));
  if (row === undefined) return {};
  const c = row;
  return { campaign: c };
};
