"use client";

import { ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { CompleteWidget } from "@/trpc/server/actions/widgets/widgets.type";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const BuySuccess = ({
  widget,
  balance,
}: {
  widget: CompleteWidget;
  balance: string;
}) => {
  const { push } = useRouter();
  return (
    <div className="max-w-lg w-full p-4">
      <div className="">
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
        <div className="border p-4 rounded-2xl w-full space-y-4 bg-primary-foreground relative text-center">
          <p className="text-center text-4xl font-medium">{balance}</p>
          <p>Solana Received!</p>
          <div className="flex max-w-xs gap-9 mx-auto flex-col ">
            <Button
              variant="outline"
              onClick={() => {
                window.location.reload();
              }}
            >
              Deposit more
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (widget?.website) {
                  window.location.href = widget.website;
                } else {
                  push(`/embed/trade/${widget.id}`);
                }
              }}
            >
              Start Trading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
