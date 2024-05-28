/* eslint-disable @next/next/no-img-element */
import { solToken } from "@/utils/defaultTokens";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { ExternalLink, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { TokenPrice } from "@/trpc/server/actions/token-balance/token-balance.type";

export const WalletSOLDetails = ({
  setShowSendSol,
  tokenPrice,
  amount,
  swapTab,
}: {
  setShowSendSol: (amount: number) => void;
  tokenPrice: TokenPrice;
  amount: number;
  swapTab: () => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useUser();
  const walletAddress = user?.publicMetadata.walletAddress as string;
  const isAmountLoaded = tokenPrice && tokenPrice[solToken.address];
  const usdValue = isAmountLoaded ? tokenPrice[solToken.address].value : 0;
  const valueChange = isAmountLoaded
    ? tokenPrice[solToken.address].priceChange24h
    : 0;

  return (
    <div className="m-4 border rounded-2xl">
      <div
        className="bg-secondary p-4 rounded-lg  cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="w-full">
          <div className="flex gap-2 items-center">
            <img
              src={solToken.imageUrl}
              alt="log"
              className="w-9 h-9 rounded-full"
            />
            <div className="w-full">
              <div className="flex justify-between items-center w-full">
                <p className="font-semibold uppercase">Solana</p>
                {isAmountLoaded && (
                  <p className="text-sm ">${(+amount * usdValue).toFixed(2)}</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm opacity-60 flex gap-2 items-center">
                  {amount.toFixed(5)} {solToken.symbol}
                </div>
                {/* {valueChange < 0 && isAmountLoaded && (
                  <p className={`text-sm text-rose-600`}>
                    -${(valueChange * -1 * +amount).toFixed(2)}
                  </p>
                )}
                {valueChange > 0 && isAmountLoaded && (
                  <p className={`text-sm text-green-600`}>
                    +${(valueChange * +amount).toFixed(2)}
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
            <p className="text-lg mb-3">
              {solToken.symbol} ${usdValue.toFixed(2)}
            </p>
            <div className="bg-secondary rounded-xl p-5">
              <p className="text-2xl">
                {amount} {solToken.symbol}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-3">
              <Button
                onClick={() => setShowSendSol(amount)}
                variant="secondary"
                className="rounded-xl flex flex-col justify-center items-center p-2 h-full w-full"
              >
                <Send />
                <p>Send</p>
              </Button>
              <a
                target="_blank"
                href={`https://solscan.io/account/${walletAddress}`}
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
};
