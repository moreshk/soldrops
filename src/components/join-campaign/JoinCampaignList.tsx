"use client";
import { CompleteCampaign } from "@/lib/db/schema/campaign";
import { trpc } from "@/lib/trpc/client";

export default function JoinCampaignList({
  campaign,
}: {
  campaign: CompleteCampaign[];
}) {
  const { data: c } = trpc.campaign.getLiveCampaigns.useQuery(undefined, {
    initialData: { campaign },
    refetchOnMount: false,
  });

  if (c.campaign.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {c.campaign.map((campaign) => (
        <Campaign campaign={campaign} key={campaign.id} />
      ))}
    </ul>
  );
}

const Campaign = ({ campaign }: { campaign: CompleteCampaign }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{campaign.tokenContractAddress}</div>
      </div>
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No campaign right now
      </h3>
    </div>
  );
};
