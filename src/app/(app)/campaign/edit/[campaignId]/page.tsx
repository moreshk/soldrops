import EditCampaign from "@/components/campaign/form/EditCampaign";
import { server } from "@/trpc/server/api";
import { notFound } from "next/navigation";

const EditPage = async ({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) => {
  const { campaign } = await server.campaign.getCampaignById.query({
    id: campaignId,
  });
  if (!campaign) return notFound();

  return (
    <div>
      <EditCampaign campaign={campaign} />
    </div>
  );
};

export default EditPage;
