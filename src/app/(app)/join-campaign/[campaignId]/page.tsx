import EditCampaign from "@/components/campaign/form/EditCampaign";
import JoinCampaign from "@/components/join-campaign/JoinCampaign";
import { server } from "@/trpc/server/api";
import { notFound } from "next/navigation";

const Page = async ({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) => {
  const { whiteList } = await server.whitelist.getWhiteListCampaignById.query({
    id: campaignId,
  });
  if (!whiteList) return notFound();
  return (
    <div>
      <JoinCampaign whiteList={whiteList} />
    </div>
  );
};

export default Page;
