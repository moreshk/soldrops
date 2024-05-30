import { Check } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { addressShortener } from "@/utils/addressShortener";

export const SendTokenSuccess = ({
  sendAmount,
  sentAddress,
  symbol,
  tx,
  onClose,
}: {
  sendAmount: string;
  sentAddress: string;
  symbol: string;
  tx: string;
  onClose: () => void;
}) => {
  return (
    <div className="flex items-center justify-center my-10 flex-col">
      <div className="w-20 h-20 bg-green-950/50 flex justify-center items-center rounded-full">
        <Check className="w-7 h-7 text-green-500" />
      </div>
      <p className="text-2xl font-medium mt-5">Sent!</p>
      <p className="text-muted-foreground mt-3 text-center">
        {sendAmount} {symbol} was successfully sent to{" "}
        {addressShortener(sentAddress)}
      </p>
      <a
        href={`https://solscan.io/tx/${tx}`}
        target="_blank"
        className={buttonVariants({ variant: "link" })}
      >
        View Transaction
      </a>
      <div className="p-4 w-full">
        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
};
