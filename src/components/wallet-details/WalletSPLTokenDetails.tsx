"use client";
/* eslint-disable @next/next/no-img-element */
import { CompleteToken } from "@/lib/trpc-api/tokens/tokens.type";

import { ArrowLeftRight, ExternalLink, Plus, Send } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { addressShortener } from "@/utils/addressShortener";
import { TypeSelectedToken, TypeWalletTokenDetails } from "./WalletDetails";

export const WalletSPLTokenDetails = ({
  walletTokenDetails,
  tokens,
  setSendSPLTokenDetails,
}: {
  walletTokenDetails: TypeWalletTokenDetails;
  tokens: CompleteToken[];
  setSendSPLTokenDetails: (value: TypeSelectedToken) => void;
}) => {
  const info = walletTokenDetails.account.data.parsed.info;
  const tokenDetails = tokens.find((token) => token.address === info.mint);
  const [showDetails, setShowDetails] = useState(false);

  if (tokenDetails) {
    return (
      <div className="m-4 border rounded-2xl">
        <div
          className="bg-secondary p-4 rounded-lg  cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="w-full">
            <div className="flex gap-2 items-center">
              <img
                src={tokenDetails.imageUrl}
                alt="log"
                className="w-9 h-9 rounded-full"
              />
              <div>
                <div>{tokenDetails.symbol}</div>
                <div className="text-sm opacity-60">
                  {info.tokenAmount.uiAmountString} {tokenDetails.symbol}
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDetails && (
          <div className="p-4">
            <div className="text-center">
              <p className="text-lg mb-3">{tokenDetails.symbol}</p>
              <div className="bg-secondary rounded-xl p-5">
                <p className="text-2xl">
                  {info.tokenAmount.uiAmountString} {tokenDetails.symbol}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-3">
                <Button
                  onClick={() =>
                    setSendSPLTokenDetails({ tokenDetails, walletTokenDetails })
                  }
                  variant="secondary"
                  className="rounded-xl flex flex-col justify-center items-center p-2 h-full w-full"
                >
                  <Send />
                  <p>Send</p>
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-xl flex flex-col justify-center items-center p-2 h-full"
                >
                  <ArrowLeftRight />
                  <p>Swap</p>
                </Button>
                <a
                  target="_blank"
                  href={`https://solscan.io/account/${walletTokenDetails.pubkey}`}
                  className={`${buttonVariants({
                    variant: "secondary",
                  })} rounded-xl flex flex-col justify-center items-center p-2 h-full`}
                >
                  <ExternalLink />
                  <p>View</p>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      // <div className="bg-secondary p-4 rounded-lg m-4">
      //   <div className="w-full">
      //     <div className="flex gap-2 items-center">
      //       <div className="w-9 h-9 rounded-full bg-muted-foreground flex-shrink-0" />
      //       <div>
      //         <p className="text-xs">{addressShortener(info.mint)}</p>
      //         <div className="text-sm opacity-60">
      //           {info.tokenAmount.uiAmountString}
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      <></>
    );
  }
};
