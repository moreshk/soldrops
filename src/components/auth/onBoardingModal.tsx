"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Coins } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

const OnBoardingModal = () => {
  const [open, setOpen] = useState(true);
  const { theme, systemTheme } = useTheme();
  const widgetTheme = (theme === "system" ? systemTheme : theme) || "dark";
  const { data: session } = useSession();
  const [showPaymentProvider, setShowPaymentProvider] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[470px]">
          <>
            <DialogHeader>
              <DialogTitle>Awesome, let’s load up some Solana!</DialogTitle>
            </DialogHeader>
            <div className="space-y-10">
              <div>
                <p>Deposit sol</p>
                <div className="border p-2 rounded-lg">
                  <p>
                    Send Solana from a CEX or another wallet to your Drops
                    account.
                  </p>
                  <p>Drops wallet address:</p>
                  <p className="text-sm break-all bg-secondary p-3 rounded-lg mt-3">
                    {session?.user.walletAddress}
                  </p>
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
