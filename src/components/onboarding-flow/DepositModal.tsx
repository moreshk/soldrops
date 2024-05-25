"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnBoarding } from "./OnBoarding";

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
    <DialogContent className="sm:max-w-lg">
      <OnBoarding title={title} buyUrl={buyUrl} />
    </DialogContent>
  </Dialog>
);

export default DepositModal;
