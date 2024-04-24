"use server";

import { revalidatePath } from "next/cache";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/lib/api/campaign/mutations";
import {
  CampaignId,
  NewCampaignParams,
  UpdateCampaignParams,
  campaignIdSchema,
  insertCampaignParams,
  updateCampaignParams,
} from "@/lib/db/schema/campaign";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCampaigns = () => revalidatePath("/campaign");

export const createCampaignAction = async (input: NewCampaignParams) => {
  try {
    const payload = insertCampaignParams.parse(input);
    await createCampaign(payload);
    revalidateCampaigns();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCampaignAction = async (input: UpdateCampaignParams) => {
  try {
    const payload = updateCampaignParams.parse(input);
    await updateCampaign(payload.id, payload);
    revalidateCampaigns();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCampaignAction = async (input: CampaignId) => {
  try {
    const payload = campaignIdSchema.parse({ id: input });
    await deleteCampaign(payload.id);
    revalidateCampaigns();
  } catch (e) {
    return handleErrors(e);
  }
};