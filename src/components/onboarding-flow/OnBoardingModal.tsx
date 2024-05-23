"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTokenBalance } from "../swap/useTokenBalance";
import { OnBoarding } from "./OnBoarding";

const OnBoardingModal = () => {
  const [open, setOpen] = useState(false);
  const { balance } = useTokenBalance(true);

  useEffect(() => {
    if (typeof balance === "number") {
      if (!balance) setOpen(true);
    }
  }, [balance]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <OnBoarding />
      </DialogContent>
    </Dialog>
  );
};

export default OnBoardingModal;
