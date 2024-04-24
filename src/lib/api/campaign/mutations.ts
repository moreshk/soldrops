import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  CampaignId,
  NewCampaignParams,
  UpdateCampaignParams,
  updateCampaignSchema,
  insertCampaignSchema,
  campaign,
  campaignIdSchema
} from "@/lib/db/schema/campaign";
import { getUserAuth } from "@/lib/auth/utils";

export const createCampaign = async (campaignData: NewCampaignParams) => {
  const { session } = await getUserAuth();
  const newCampaign = insertCampaignSchema.parse({ ...campaignData, userId: session?.user.id! });
  try {
    const [c] = await db.insert(campaign).values(newCampaign).returning();
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCampaign = async (id: CampaignId, campaignData: UpdateCampaignParams) => {
  const { session } = await getUserAuth();
  const { id: campaignId } = campaignIdSchema.parse({ id });
  const newCampaign = updateCampaignSchema.parse({ ...campaignData, userId: session?.user.id! });
  try {
    const [c] = await db
      .update(campaign)
      .set({ ...newCampaign, updatedAt: new Date() })
      .where(and(eq(campaign.id, campaignId!), eq(campaign.userId, session?.user.id!)))
      .returning();
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCampaign = async (id: CampaignId) => {
  const { session } = await getUserAuth();
  const { id: campaignId } = campaignIdSchema.parse({ id });
  try {
    const [c] = await db.delete(campaign).where(and(eq(campaign.id, campaignId!), eq(campaign.userId, session?.user.id!)))
      .returning();
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

