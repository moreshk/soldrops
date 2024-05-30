"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnBoarding } from "./OnBoarding";
import { trpc } from "@/trpc/client/api";
import { CircleX } from "lucide-react";

const OnBoardingModal = ({ buyUrl }: { buyUrl?: string }) => {
  const [open, setOpen] = useState(false);
  const { data } = trpc.tokenBalance.getSolTokenBalance.useQuery(undefined, {
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
  const balance = data?.balance;

  useEffect(() => {
    if (typeof balance === "number") {
      if (balance) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }, [balance]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <div className="absolute right-4 top-4">
          <button onClick={() => setOpen(false)}>
            <CircleX />
          </button>
        </div>
        <OnBoarding buyUrl={buyUrl} />
      </DialogContent>
    </Dialog>
  );
};

export default OnBoardingModal;
