import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  CampaignId,
  NewCampaignParams,
  UpdateCampaignParams,
  insertCampaignSchema,
  campaign,
  campaignIdSchema,
  updateCampaignParams,
} from "@/lib/db/schema/campaign";
import { getUserAuth } from "@/lib/auth/utils";
import { novu } from "@/lib/novu/novu";
import { revalidatePath } from "next/cache";

export const createCampaign = async (campaignData: NewCampaignParams) => {
  const { session } = await getUserAuth();
  const newCampaign = insertCampaignSchema.parse({
    ...campaignData,
    userId: session?.user.id!,
  });
  try {
    const [c] = await db.insert(campaign).values(newCampaign).returning();
    await novu.topics.create({
      key: c.id,
      name: "Campaign",
    });
    await novu.topics.addSubscribers(c.id, {
      subscribers: [session?.user.id!],
    });
    const a = await novu.broadcast("new-campaign-created", {
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
  const { session } = await getUserAuth();
  const { id: campaignId } = campaignIdSchema.parse({ id });
  const updatedCampaign = updateCampaignParams.parse({
    ...campaignData,
    userId: session?.user.id!,
  });
  try {
    const [c] = await db
      .update(campaign)
      .set({
        updatedAt: new Date(),
        goLiveData: updatedCampaign.goLiveData,
        twitterHandel: updatedCampaign.twitterHandel,
        announcementTweet: updatedCampaign.announcementTweet,
      })
      .where(
        and(
          eq(campaign.id, campaignId!),
          eq(campaign.userId, session?.user.id!)
        )
      )
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
  const { session } = await getUserAuth();
  const { id: campaignId } = campaignIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(campaign)
      .where(
        and(
          eq(campaign.id, campaignId!),
          eq(campaign.userId, session?.user.id!)
        )
      )
      .returning();
    const response = await novu.topics.delete(campaignId);
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
