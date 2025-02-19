"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { solToken } from "@/utils/defaultTokens";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/trpc/client/api";

export const OnBoarding = ({
  title,
  buyUrl,
}: {
  title?: string;
  buyUrl?: string;
}) => {
  const { data, refetch } = trpc.tokenBalance.getSolTokenBalance.useQuery(
    undefined,
    {
      refetchInterval: 60000,
      refetchIntervalInBackground: true,
    }
  );
  const balance = data?.balance;
  const [copied, setCopied] = useState(false);
  const { user } = useUser();
  const walletAddress = user?.publicMetadata.walletAddress as string;

  const copy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  return (
    <div>
      <div className="grid gap-2 md:gap-6 w-full">
        <h1 className="text-center md:text-3xl text-balance md:pt-6">
          {title ?? "Awesome, let’s load up some SOL!"}
        </h1>
        <div>
          <h1 className="font-medium uppercase text-center md:pt-4 text-sm">
            Deposit SOL
          </h1>
          <div className="border-2 border-secondary-foreground rounded-2xl p-5 mt-2">
            <p className="text-center text-balance text-sm max-w-sm mx-auto">
              Send SOL from a CEX or another wallet to your Drops account.
            </p>
            <div className="mt-5">
              <p className="text-center">Drops wallet address:</p>
              {walletAddress && (
                <div className="flex items-center justify-center">
                  <button
                    onClick={copy}
                    className={
                      "text-xs break-all font-bold bg-secondary text-balance rounded-lg p-3"
                    }
                  >
                    {walletAddress}
                  </button>
                  <Button
                    onClick={copy}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md:mt-8">
        <div className="md:space-y-4">
          <p className="mb-4 md:font-bold uppercase text-center pt-4 text-balance mx-auto">
            BUY SOL WITH CREDIT/DEBIT CARD
          </p>
          {buyUrl ? (
            <a href={buyUrl} target="_blank">
              <div className="p-2 rounded-2xl h-40 flex flex-col justify-center items-center text-lg text-center space-y-3 border-2 border-secondary-foreground">
                <p className=" max-w-sm text-center mx-auto text-balance text-sm">
                  Purchase SOL with Google/Apple pay and 190 other payment
                  options.
                </p>
                <Image src="/on.png" width={100} height={100} alt="logo" />
              </div>
            </a>
          ) : (
            <Link href="/buy">
              <div className="p-2 rounded-2xl h-40 flex flex-col justify-center items-center text-lg text-center space-y-3 border-2 border-secondary-foreground">
                <p className=" max-w-sm text-center mx-auto text-balance text-sm">
                  Purchase SOL with Google/Apple pay and 190 other payment
                  options.
                </p>
                <Image src="/on.png" width={100} height={100} alt="logo" />
              </div>
            </Link>
          )}
        </div>
      </div>
      {balance ? (
        <div className="mx-auto w-full flex justify-center items-center md:mt-3">
          <Button className="uppercase font-bold rounded-full mt-7">
            Sol Balance - {balance ? balance / 10 ** solToken.decimal : "-"}
          </Button>
        </div>
      ) : (
        <div className="mx-auto w-full flex justify-center items-center md:mt-3">
          <Button
            className="uppercase font-bold rounded-full "
            onClick={async () => await refetch()}
          >
            Detect Balance
          </Button>
        </div>
      )}
    </div>
  );
};
