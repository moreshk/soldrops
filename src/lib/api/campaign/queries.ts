import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type CampaignId,
  campaignIdSchema,
  campaign,
} from "@/lib/db/schema/campaign";

export const getCampaigns = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(campaign)
    .where(eq(campaign.userId, session?.user.id!));
  const c = rows;
  return { campaign: c };
};

export const getLiveCampaigns = async () => {
  const rows = await db
    .select()
    .from(campaign)
    .where(eq(campaign.isCampaignEnded, true));
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
