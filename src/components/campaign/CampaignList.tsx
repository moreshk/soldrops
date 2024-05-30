/* eslint-disable @next/next/no-img-element */
"use client";
import { trpc } from "@/trpc/client/api";
import { format } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { CompleteCampaign } from "@/trpc/server/actions/campaign/campaign.types";

export default function CampaignList({
  campaign,
}: {
  campaign: CompleteCampaign[];
}) {
  const { data: c } = trpc.campaign.getCampaigns.useQuery(undefined, {
    initialData: { campaign },
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
    <li className="flex justify-between border p-3 rounded-lg my-3">
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
      <div className="space-y-2">
        <Link
          href={`/campaign/edit/${campaign.id}`}
          className={buttonVariants({ variant: "outline" })}
        >
          Edit
        </Link>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/join-campaign/${campaign.id}`}
        >
          View Join page
        </Link>
      </div>
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
        <Link
          href="/campaign/create"
          className={buttonVariants({ variant: "default" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          New Campaign
        </Link>
      </div>
    </div>
  );
};
