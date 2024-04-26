import JoinCampaignList from "@/components/join-campaign/JoinCampaignList";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Campaign() {
  await checkAuth();
  const { campaign } = await api.campaign.getLiveCampaigns.query();

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Join Campaign</h1>
      </div>
      <JoinCampaignList campaign={campaign} />
    </main>
  );
}
