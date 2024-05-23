import JoinCampaignList from "@/components/join-campaign/JoinCampaignList";
import { api } from "@/lib/trpc-client/api";
import { SignedIn } from "@clerk/nextjs";

export default async function Campaign() {
  const { campaign } = await api.campaign.getLiveCampaigns.query();

  return (
    <SignedIn>
      <main>
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Join Campaign</h1>
        </div>
        <JoinCampaignList campaign={campaign} />
      </main>
    </SignedIn>
  );
}
