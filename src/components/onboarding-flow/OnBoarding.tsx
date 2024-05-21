"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useTokenBalance } from "../swap/useTokenBalance";
import { solToken } from "@/lib/tokens/utils/defaultTokens";
import { AuthLoginSignup } from "../auth/AuthLoginSignup";
import Image from "next/image";

export const OnBoarding = () => {
  const { balance, refetch } = useTokenBalance(true);
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const walletAddress = session?.user.walletAddress;

  const copy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  if (session)
    return (
      <div>
        <div className="grid gap-6 w-full">
          <h1 className="text-center text-3xl text-balance pt-6">
            Awesome, let’s load up some SOL!
          </h1>
          <div>
            <h1 className="font-bold uppercase text-center pt-4">
              Deposit SOL
            </h1>
            <div className="border-2 border-secondary-foreground rounded-2xl p-5 mt-2">
              <p className="text-center text-balance text-sm">
                Send SOL from a CEX or another wallet to your Drops account.
              </p>
              <div className="mt-5">
                <p className="text-center">Drops wallet address:</p>
                {walletAddress && (
                  <div className="flex items-center">
                    <Button
                      onClick={copy}
                      variant="ghost"
                      className="break-all text-xs"
                    >
                      <p className="font-bold">{walletAddress}</p>
                    </Button>
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
        <div className="mt-8">
          <div className="space-y-4">
            <p className="mb-4 font-bold uppercase text-center pt-4 max-w-60 text-balance mx-auto">
              BUY SOL WITH CREDIT/DEBIT CARD
            </p>
            <Link href="/buy">
              <div className="p-2 rounded-2xl h-40 flex flex-col justify-center items-center text-lg text-center space-y-3 border-2 border-secondary-foreground">
                <p className=" max-w-sm text-center mx-auto text-balance text-sm">
                  Purchase SOL with Google/Apple pay and 190 other payment
                  options.
                </p>
                <Image src="/on.png" width={100} height={100} alt="logo" />
              </div>
            </Link>
          </div>
        </div>
        {balance ? (
          <div className="mx-auto w-full flex justify-center items-center mt-3">
            <Button className="uppercase font-bold rounded-full mt-7">
              Sol Balance - {balance ? balance / 10 ** solToken.decimal : "-"}
            </Button>
          </div>
        ) : (
          <div className="mx-auto w-full flex justify-center items-center mt-3">
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

  return (
    <div>
      <AuthLoginSignup />
    </div>
  );
};
