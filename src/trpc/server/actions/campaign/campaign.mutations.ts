import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  CampaignId,
  NewCampaignParams,
  UpdateCampaignParams,
  insertCampaignSchema,
  campaignIdSchema,
  updateCampaignParams,
} from "@/trpc/server/actions/campaign/campaign.types";
import { campaign } from "@/lib/db/schema/campaign";
import { novu } from "@/lib/novu/novu";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export const createCampaign = async (campaignData: NewCampaignParams) => {
  const { userId } = auth();
  const newCampaign = insertCampaignSchema.parse({
    ...campaignData,
    userId: userId!,
  });
  try {
    const [c] = await db.insert(campaign).values(newCampaign).returning();
    await novu.topics.create({
      key: c.id,
      name: "Campaign",
    });
    await novu.topics.addSubscribers(c.id, {
      subscribers: [userId!],
    });
    await novu.broadcast("new-campaign-created", {
      payload: {
        token_name: c.tokenSymbol,
        campain_id: c.id,
      },
    });
    revalidatePath("/campaign", "page");
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCampaign = async (
  id: CampaignId,
  campaignData: UpdateCampaignParams
) => {
  const { userId } = auth();
  const { id: campaignId } = campaignIdSchema.parse({ id });
  const updatedCampaign = updateCampaignParams.parse({
    ...campaignData,
    userId: userId!,
  });
  try {
    const [c] = await db
      .update(campaign)
      .set({
        updatedAt: new Date(),
        startDate: updatedCampaign.startDate,
        endDate: updatedCampaign.endDate,
        twitterHandel: updatedCampaign.twitterHandel,
        announcementTweet: updatedCampaign.announcementTweet,
      })
      .where(and(eq(campaign.id, campaignId!), eq(campaign.userId, userId!)))
      .returning();
    revalidatePath("/campaign", "page");
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCampaign = async (id: CampaignId) => {
  const { userId } = auth();
  const { id: campaignId } = campaignIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(campaign)
      .where(and(eq(campaign.id, campaignId!), eq(campaign.userId, userId!)))
      .returning();
    await novu.topics.delete(campaignId);
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
