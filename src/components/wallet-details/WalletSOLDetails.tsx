/* eslint-disable @next/next/no-img-element */
import { solToken } from "@/lib/tokens/utils/defaultTokens";
import { trpc } from "@/lib/trpc/client";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeftRight, ExternalLink, Send } from "lucide-react";
import { useSession } from "next-auth/react";

export const WalletSOLDetails = ({
  setShowSendSol,
}: {
  setShowSendSol: (amount: number) => void;
}) => {
  const { data, isLoading } = trpc.tokens.getSolTokenBalance.useQuery();
  const amount = data?.balance ? data.balance / 10 ** solToken.decimal : 0;
  const [showDetails, setShowDetails] = useState(false);
  const { data: session } = useSession();
  return (
    <div className="m-4 border rounded-2xl">
      <div
        className="bg-secondary p-4 rounded-lg  cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="w-full">
          <div className="flex gap-2 items-center">
            <img
              src={solToken.imageUrl}
              alt="log"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <div>{solToken.symbol}</div>
              <div className="text-sm opacity-60 flex gap-2 items-center">
                <>
                  {isLoading ? (
                    <div className="w-14 h-3 rounded-xl bg-muted-foreground" />
                  ) : (
                    <>{amount}</>
                  )}
                </>{" "}
                {solToken.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDetails && (
        <div className="p-4">
          <div className="text-center">
            <p className="text-lg mb-3">{solToken.symbol}</p>
            <div className="bg-secondary rounded-xl p-5">
              <p className="text-2xl">
                {amount} {solToken.symbol}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-3">
              <Button
                onClick={() => setShowSendSol(amount)}
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
                href={`https://solscan.io/account/${session?.user.walletAddress}`}
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
