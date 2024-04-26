import EditCampaign from "@/components/campaign/form/EditCampaign";
import { api } from "@/lib/trpc/api";

const EditPage = async ({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) => {
  const { campaign } = await api.campaign.getCampaignById.query({
    id: campaignId,
  });
  if (campaign) {
    return (
      <div>
        <EditCampaign campaign={campaign} />
      </div>
    );
  }
  return <div>No Campaign found</div>;
};

export default EditPage;
