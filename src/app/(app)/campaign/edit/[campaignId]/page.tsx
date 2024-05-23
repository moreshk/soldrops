import EditCampaign from "@/components/campaign/form/EditCampaign";
import { api } from "@/lib/trpc-client/api";
import { notFound } from "next/navigation";

const EditPage = async ({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) => {
  const { campaign } = await api.campaign.getCampaignById.query({
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
