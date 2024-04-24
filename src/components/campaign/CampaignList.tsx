"use client";
import { CompleteCampaign } from "@/lib/db/schema/campaign";
import { trpc } from "@/lib/trpc/client";
import CampaignModal from "./CampaignModal";

export default function CampaignList({
  campaign,
}: {
  campaign: CompleteCampaign[];
}) {
  const { data: c } = trpc.campaign.getCampaigns.useQuery(undefined, {
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
      <CampaignModal campaign={campaign} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No campaign
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new campaign.
      </p>
      <div className="mt-6">
        <CampaignModal emptyState={true} />
      </div>
    </div>
  );
};
