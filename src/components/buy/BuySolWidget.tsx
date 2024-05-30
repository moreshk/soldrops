"use client";
import { BuySOL } from "@/components/buy/BuySOL";
import { buttonVariants } from "@/components/ui/button";
import { trpc } from "@/trpc/client/api";
import { CompleteWidget } from "@/trpc/server/actions/widgets/widgets.type";
import { solToken } from "@/utils/defaultTokens";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BuySuccess } from "./BuySuccess";

export const BuySolWidget = ({ widget }: { widget: CompleteWidget }) => {
  const [isDeposited, setIsDeposited] = useState<number | undefined>();
  const [balanceChange, setBalanceChange] = useState<number | undefined>();
  const [showBuy, setShowBuy] = useState<boolean>(true);
  const { data } = trpc.tokenBalance.getSolTokenBalance.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const balance = data?.balance ? data.balance / 10 ** solToken.decimal : 0;

  useEffect(() => {
    if (data?.balance && !isDeposited) {
      setIsDeposited(balance + 0.001);
    }
  }, [balance, data, isDeposited]);

  useEffect(() => {
    if (balance && isDeposited) {
      if (balance >= isDeposited) {
        console.log(balance, isDeposited);
        const tokenDifference = balance - (isDeposited - 0.001);
        setBalanceChange(tokenDifference);
        setShowBuy(false);
      }
    }
  }, [balance, isDeposited]);

  if (showBuy) {
    return (
      <div>
        <div className="h-[calc(100vh-120px)] flex justify-center items-center flex-col w-full">
          <div className="flex justify-between w-full max-w-md mb-3 items-center">
            {widget?.website ? (
              <a
                href={widget?.website}
                className={`flex gap-2 items-center ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                <ArrowLeft />
                <p className="font-bold">Go Back</p>
              </a>
            ) : (
              <Link
                href={`/embed/trade/${widget.id}`}
                className={`flex gap-2 items-center ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                <ArrowLeft />
                <p className="font-bold">Go Back</p>
              </Link>
            )}
            <div />
          </div>
          <BuySOL
            failureRedirectUrl={`${process.env.NEXT_PUBLIC_URL!}/embed/buy/${
              widget.id
            }?tokenTransfer=error`}
            successRedirectUrl={`${process.env.NEXT_PUBLIC_URL!}/embed/buy/${
              widget.id
            }?tokenTransfer=success`}
          />
        </div>
      </div>
    );
  }
  return (
    <BuySuccess balance={`${balanceChange?.toFixed(4)}`} widget={widget} />
  );
};
