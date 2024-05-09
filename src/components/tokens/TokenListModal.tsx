"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TokenListModal = ({
  open,
  onChange,
}: {
  open: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Token List </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Button>Connect Twitter</Button>
          <Button>Connect Twitter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenListModal;
