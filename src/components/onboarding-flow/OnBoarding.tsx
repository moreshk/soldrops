"use client";

import { Button } from "@/components/ui/button";
import { Check, Coins, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useTokenBalance } from "../swap/useTokenBalance";
import { solToken } from "@/lib/tokens/utils/defaultTokens";

export const OnBoarding = () => {
  const { balance } = useTokenBalance(true);
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

  return (
    <div>
      <div className="grid gap-6 w-full">
        <h1 className="text-center">Awesome, let’s load up some Solana!</h1>
        <h1>Solana Account Address</h1>
        {walletAddress && (
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={copy}
              variant="outline"
              className="p-2 rounded-md border break-all flex-1 justify-start group"
            >
              <p>{walletAddress}</p>
            </Button>
            <Button
              onClick={copy}
              variant="outline"
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
      <div className="mt-8">
        <div className="space-y-4">
          <p className="mb-4">BUY SOLANA WITH CREDIT/DEBIT CARD</p>
          <Link href="/buy">
            <div className="border p-2 rounded-lg text-lg text-center space-y-3">
              <p className="font-medium">
                Purchase Solana with Google/Apple pay and 190 other payment
              </p>
              <Coins className="w-12 h-12 mx-auto" />
            </div>
          </Link>
        </div>
      </div>
      <div className="border rounded-xl p-4 flex gap-2 my-4">
        <p>Current Sol Balance </p>
        <div>{balance ? balance / 10 ** solToken.decimal : "-"}</div>
      </div>
    </div>
  );
};
