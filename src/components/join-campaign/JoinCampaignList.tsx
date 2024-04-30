/* eslint-disable @next/next/no-img-element */
"use client";
import { CompleteCampaign } from "@/lib/db/schema/campaign";
import { trpc } from "@/lib/trpc/client";
import { format } from "date-fns";
import { buttonVariants } from "../ui/button";
import Link from "next/link";

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
    <li className="flex justify-between my-2 border rounded-xl p-7">
      <div className="w-full flex items-center gap-3">
        <img
          src={campaign.tokenImage}
          alt="token symbol"
          width={60}
          height={60}
          className="rounded-full flex-shrink-0"
        />
        <div>
          <div>
            {campaign.tokenSymbol} ({campaign.tokenContractAddress})
          </div>
          <div>
            Go live date - {format(new Date(campaign.startDate), "PPP")}
          </div>
          <div>
            Campain End date - {format(new Date(campaign.endDate), "PPP")}
          </div>
          {campaign.twitterHandel && (
            <div>Twitter handel {campaign.twitterHandel}</div>
          )}
          {campaign.announcementTweet && (
            <div>Twitter handel {campaign.announcementTweet}</div>
          )}
          <div className="flex items-center gap-4">
            <p>Total Tokens drop {campaign.totalTokenDrop}</p>
            <p>Total Wallets can join campaign {campaign.totalWalletNumber}</p>
          </div>
        </div>
      </div>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={`/join-campaign/${campaign.id}`}
      >
        Join Campaign
      </Link>
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
