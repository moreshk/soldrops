"use client";
/* eslint-disable @next/next/no-img-element */
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";

import { ArrowLeftRight, ExternalLink, Plus, Send } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { TypeSelectedToken, TypeWalletTokenDetails } from "./WalletDetails";
import { TokenPrice } from "@/trpc/server/actions/token-balance/token-balance.type";
import { useTradeStoreSelectors } from "@/store/trade-store";

export const WalletSPLTokenDetails = ({
  walletTokenDetails,
  tokens,
  setSendSPLTokenDetails,
  tokenPrice,
  swapTab,
}: {
  walletTokenDetails: TypeWalletTokenDetails;
  tokens: CompleteToken[];
  setSendSPLTokenDetails: (value: TypeSelectedToken) => void;
  tokenPrice: TokenPrice;
  swapTab: () => void;
}) => {
  const info = walletTokenDetails.account.data.parsed.info;
  const tokenDetails = tokens.find((token) => token.address === info.mint);
  const [showDetails, setShowDetails] = useState(false);
  const setReceiveToken = useTradeStoreSelectors.use.setReceiveToken();

  if (tokenDetails) {
    const isAmountLoaded =
      !!info.tokenAmount.uiAmountString &&
      tokenPrice &&
      tokenPrice[tokenDetails.address];
    const usdValue = isAmountLoaded
      ? +info.tokenAmount.uiAmountString *
        tokenPrice[tokenDetails.address].value
      : 0;
    const valueChange = isAmountLoaded
      ? tokenPrice[tokenDetails.address].priceChange24h
      : 0;

    return (
      <div className="m-4 border rounded-2xl cursor-pointer">
        <div
          className="bg-secondary p-4 rounded-lg "
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="w-full">
            <div className="flex gap-2 items-center">
              <img
                src={tokenDetails.imageUrl}
                alt="log"
                className="w-9 h-9 rounded-full"
              />
              <div className="w-full">
                <div className="flex justify-between items-center w-full">
                  <p className="font-semibold">{tokenDetails.symbol}</p>
                  {isAmountLoaded && (
                    <p className="text-sm ">${usdValue.toFixed(2)}</p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-60">
                    {info.tokenAmount.uiAmountString} {tokenDetails.symbol}
                  </div>
                  {/* {valueChange < 0 && isAmountLoaded && (
                    <p className={`text-sm text-rose-600`}>
                      -$
                      {(
                        valueChange *
                        -1 *
                        +info.tokenAmount.uiAmountString
                      ).toFixed(2)}
                    </p>
                  )}
                  {valueChange > 0 && isAmountLoaded && (
                    <p className={`text-sm text-green-600`}>
                      +$
                      {valueChange.toFixed(2)}
                    </p>
                  )} */}
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
                  onClick={() => {
                    swapTab();
                    setReceiveToken(tokenDetails);
                  }}
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
