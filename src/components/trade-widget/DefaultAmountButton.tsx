import { useTradeStoreSelectors } from "@/store/trade-store";
import DepositModal from "../onboarding-flow/DepositModal";
import { useState } from "react";

export const DefaultAmountButton = ({
  amount,
  balance,
  buyUrl,
}: {
  amount: number;
  balance: number;
  buyUrl?: string;
}) => {
  const [open, setOpen] = useState(false);
  const setAmountInput = useTradeStoreSelectors.use.setAmountInput();
  const getQuoteAmount = useTradeStoreSelectors.use.getQuoteAmount();

  return (
    <>
      <button
        onClick={() => {
          if (+balance <= amount) {
            setOpen(true);
          } else {
            setAmountInput(`${amount}`);
            getQuoteAmount();
          }
        }}
        className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
      >
        ${amount}
      </button>
      <DepositModal
        open={open}
        setOpen={setOpen}
        title="Insufficient SOl Please Deposit"
        buyUrl={buyUrl}
      />
    </>
  );
};
