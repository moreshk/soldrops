/* eslint-disable @next/next/no-img-element */
import { Campaign } from "@/lib/trpc-api/campaign/campaign.types";
import { Whitelist } from "@/lib/trpc-api/whitelist/whitelist.type";
import { format } from "date-fns";

interface CampaignWhiteList extends Whitelist {
  campaignDetails: Campaign;
}

export const WhiteListedList = ({ list }: { list: CampaignWhiteList[] }) => {
  return (
    <div>
      {list.map(({ campaignDetails, id }) => (
        <div key={id} className="border rounded-3xl p-3">
          <div className="w-full flex items-center gap-3">
            <img
              src={campaignDetails.tokenImage}
              alt="token symbol"
              width={60}
              height={60}
              className="rounded-full flex-shrink-0"
            />
            <div>
              <div>
                {campaignDetails.tokenSymbol} (
                {campaignDetails.tokenContractAddress})
              </div>
              <div>
                Go live date -{" "}
                {format(new Date(campaignDetails.startDate), "PPP")}
              </div>
              <div>
                Campain End date -{" "}
                {format(new Date(campaignDetails.endDate), "PPP")}
              </div>
              {campaignDetails.twitterHandel && (
                <div>Twitter handel {campaignDetails.twitterHandel}</div>
              )}
              {campaignDetails.announcementTweet && (
                <div>Twitter handel {campaignDetails.announcementTweet}</div>
              )}
              <div className="flex items-center gap-4">
                <p>Total Tokens drop {campaignDetails.totalTokenDrop}</p>
                <p>
                  Total Wallets can join campaignDetails{" "}
                  {campaignDetails.totalWalletNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
