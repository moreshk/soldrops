"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnBoarding } from "./OnBoarding";
import { CircleX } from "lucide-react";

const DepositModal = ({
  open,
  setOpen,
  title,
  buyUrl,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  title?: string;
  buyUrl?: string;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-lg overflow-y-auto">
      <div className="absolute right-4 top-4">
        <button onClick={() => setOpen(false)}>
          <CircleX />
        </button>
      </div>
      <OnBoarding title={title} buyUrl={buyUrl} />
    </DialogContent>
  </Dialog>
);

export default DepositModal;
