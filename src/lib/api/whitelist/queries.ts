import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type WhitelistId,
  whitelistIdSchema,
  whitelist,
} from "@/lib/db/schema/whitelist";
import { CampaignId, campaignIdSchema } from "@/lib/db/schema/campaign";
import { createWhitelist } from "./mutations";

export const getWhitelists = async () => {
  const { session } = await getUserAuth();
  const rows = await db.query.whitelist.findMany({
    where: and(
      eq(whitelist.userId, session?.user.id!),
      eq(whitelist.whitelisted, true)
    ),
    with: {
      campaignDetails: true,
    },
  });

  return { whitelist: rows };
};

export const getWhitelistById = async (id: WhitelistId) => {
  const { session } = await getUserAuth();
  const { id: whitelistId } = whitelistIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(whitelist)
    .where(
      and(
        eq(whitelist.id, whitelistId),
        eq(whitelist.userId, session?.user.id!)
      )
    );
  if (row === undefined) return {};
  const w = row;
  return { whitelist: w };
};

export const getWhiteListCampaignById = async (id: CampaignId) => {
  const { session } = await getUserAuth();
  const { id: campaignId } = campaignIdSchema.parse({ id });
  const c = await db.query.whitelist.findFirst({
    where: and(
      eq(whitelist.campaignId, campaignId),
      eq(whitelist.userId, session?.user.id!)
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
        eq(whitelist.userId, session?.user.id!)
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
