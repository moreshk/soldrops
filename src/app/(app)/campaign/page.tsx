import CampaignList from "@/components/campaign/CampaignList";
import NewCampaignModal from "@/components/campaign/CampaignModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Campaign() {
  await checkAuth();
  const { campaign } = await api.campaign.getCampaigns.query();

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Campaign</h1>
        <NewCampaignModal />
      </div>
      <CampaignList campaign={campaign} />
    </main>
  );
}
