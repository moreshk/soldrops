"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Coins, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useTokenBalance } from "../swap/useTokenBalance";

const OnBoardingModal = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { balance } = useTokenBalance(true);

  useEffect(() => {
    if (typeof balance === "number") {
      if (!balance) setOpen(true);
    }
  }, [balance]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <>
            <DialogHeader>
              <DialogTitle>Awesome, let’s load up some Solana!</DialogTitle>
            </DialogHeader>
            <div className="space-y-10">
              <div>
                <p>Deposit sol</p>
                <p>Current Balance - {balance}</p>
                <div className="border p-2 rounded-lg">
                  <p>
                    Send Solana from a CEX or another wallet to your Drops
                    account.
                  </p>
                  <p>Drops wallet address:</p>
                  <div className="flex items-center gap-2 mt-3">
                    <p className="text-sm break-all bg-secondary p-3 rounded-lg">
                      {session?.user.walletAddress}
                    </p>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (session?.user.walletAddress) {
                          navigator.clipboard.writeText(
                            session?.user.walletAddress
                          );
                          toast.success("Wallet address copied");
                        }
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <p>BUY SOLANA WITH CREDIT/DEBIT CARD</p>
                <Link href="/buy">
                  <div className="border p-2 rounded-lg">
                    <p>
                      Purchase Solana with Google/Apple pay and 190 other
                      payment
                    </p>
                    <Coins className="w-12 h-12 mx-auto" />
                  </div>
                </Link>
              </div>
            </div>
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnBoardingModal;
