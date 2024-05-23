"use client";
/* eslint-disable @next/next/no-img-element */
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { trpc } from "@/lib/trpc-client/client";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Whitelist } from "@/lib/trpc-api/whitelist/whitelist.type";
import { Campaign } from "@/lib/trpc-api/campaign/campaign.types";
import { useUser } from "@clerk/nextjs";

interface CampaignWhiteList extends Whitelist {
  campaignDetails: Campaign;
}

const JoinCampaign = ({ whiteList }: { whiteList: CampaignWhiteList }) => {
  const [followTwitter, setFollowTwitter] = useState<boolean>(
    whiteList.followTwitter
  );
  const [retweet, setRetweet] = useState<boolean>(
    whiteList.retweetAnnouncement
  );
  const [whiteListed, setWhitelisted] = useState<boolean>(
    whiteList.whitelisted
  );
  const { user } = useUser();
  const walletAddress = user?.publicMetadata.walletAddress as string;

  const {
    mutate: updateFollowTwitter,
    isLoading: isUpdateFollowTwitterLoading,
  } = trpc.whitelist.updateWhitelist.useMutation({
    onSuccess: (res) => {
      setFollowTwitter(true);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const { mutate: updateReTweet, isLoading: isUpdateRetweetLoading } =
    trpc.whitelist.updateWhitelist.useMutation({
      onSuccess: (res) => {
        setRetweet(true);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  const { mutate: addToWhiteList, isLoading: isAddWhiteListUpdating } =
    trpc.whitelist.updateWhitelist.useMutation({
      onSuccess: (res) => {
        setWhitelisted(true);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  const isWhitelisted = followTwitter && retweet && whiteListed;
  const campaign = whiteList.campaignDetails;

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-xl mb-5">
        Join {campaign.tokenSymbol} Campaign to Eligible for Drop
      </div>
      <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 focus-within:border-blue-300 hover:border-blue-300 group">
        <legend className="text-lg font-medium group-hover:text-blue-300">
          Token details
        </legend>
        <div className="space-y-5">
          <div className="w-full gap-3">
            <div>Token Address - {campaign.tokenContractAddress}</div>
            <div>Token Symbol - {campaign.tokenSymbol}</div>
            <img
              src={campaign.tokenImage}
              alt="token symbol"
              width={60}
              height={60}
              className="rounded-full flex-shrink-0"
            />
            <p>Join the campaign to get</p>
            <Badge>
              {campaign.totalTokenDrop / campaign.totalWalletNumber}{" "}
              {campaign.tokenSymbol}
            </Badge>
          </div>
        </div>
      </fieldset>
      {isWhitelisted ? (
        <p className="mt-10">
          ypu are Eligible for the claim we will notify on twitter and inapp
          notification
        </p>
      ) : (
        <>
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Follow Twitter
            </legend>
            <div>
              <div>{campaign.twitterHandel}</div>
              {followTwitter ? (
                <CheckCircle2 className="bg-green-600" />
              ) : (
                <Button
                  disabled={isUpdateFollowTwitterLoading}
                  onClick={async () => {
                    window.open(
                      `https://twitter.com/${
                        campaign.twitterHandel || "soldropsxyz"
                      }`,
                      "_blank"
                    );
                    updateFollowTwitter({
                      id: whiteList.id,
                      followTwitter: true,
                      retweetAnnouncement: false,
                      whitelisted: false,
                    });
                  }}
                >
                  {isUpdateFollowTwitterLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUpdateFollowTwitterLoading
                    ? "Verifying follow..."
                    : "Following"}
                </Button>
              )}
            </div>
          </fieldset>
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Retweet Announcement
            </legend>
            <div>
              <div>{campaign.announcementTweet}</div>
              {retweet ? (
                <CheckCircle2 className="bg-green-600" />
              ) : (
                <Button
                  onClick={() => {
                    window.open(
                      campaign.announcementTweet ||
                        "https://twitter.com/soldropsxyz/status/1770446613271703697",
                      "_blank"
                    );
                    updateReTweet({
                      id: whiteList.id,
                      followTwitter: true,
                      retweetAnnouncement: true,
                      whitelisted: false,
                    });
                  }}
                  disabled={isUpdateRetweetLoading}
                >
                  {isUpdateRetweetLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUpdateRetweetLoading ? "Verifying Retweet..." : "Retweet"}
                </Button>
              )}
            </div>
          </fieldset>
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Get Whitelisted
            </legend>
            {whiteListed ? (
              <CheckCircle2 className="bg-green-600" />
            ) : (
              <Button
                onClick={() => {
                  addToWhiteList({
                    id: whiteList.id,
                    followTwitter: true,
                    retweetAnnouncement: true,
                    whitelisted: true,
                  });
                }}
                disabled={isAddWhiteListUpdating}
                className="w-full"
              >
                {isAddWhiteListUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isAddWhiteListUpdating
                  ? `Whitelisting....`
                  : ` Join WhiteList ${walletAddress}`}
              </Button>
            )}
          </fieldset>
        </>
      )}
    </div>
  );
};

export default JoinCampaign;
