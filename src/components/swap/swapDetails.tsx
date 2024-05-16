"use client";

import { ArrowUpDown, Wallet } from "lucide-react";
import { SwapInput } from "../ui/swap-Input";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { CompleteToken } from "@/lib/db/schema/tokens";
import { InputFocusEnum, useSwapStoreSelectors } from "@/store/swap-store";
import { useDebouncedCallback } from "use-debounce";
import { ReloadIcon } from "@radix-ui/react-icons";
import OnBoardingModal from "../auth/onBoardingModal";
import { useSearchParams } from "next/navigation";
import TokenTransferredModal from "../auth/tokenTransferredModal";
import { SwapConfirmationModal } from "./swapConfirmationModal";
import { useEffect, useState } from "react";
import { LoginSignupModal } from "../auth/modal/LoginSignupModal";
import { trpc } from "@/lib/trpc/client";

declare global {
  interface Window {
    trpc: ReturnType<typeof trpc.useUtils>["client"];
  }
}
export const SwapDetails = ({ tokens }: { tokens: CompleteToken[] }) => {
  const { status } = useSession();
  window.trpc = trpc.useUtils().client;
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const tokenTransfer = searchParams.get("tokenTransfer") as
    | "success"
    | "error"
    | undefined;

  const sendToken = useSwapStoreSelectors.use.sendToken();
  const receiveToken = useSwapStoreSelectors.use.receiveToken();
  const onArrayUpDownClick = useSwapStoreSelectors.use.onArrayUpDownClick();
  const setReceiveToken = useSwapStoreSelectors.use.setReceiveToken();
  const setSendToken = useSwapStoreSelectors.use.setSendToken();
  const setReceiveAmount = useSwapStoreSelectors.use.setReceiveAmount();
  const receiveBalance = useSwapStoreSelectors.use.receiveBalance();
  const setSendAmount = useSwapStoreSelectors.use.setSendAmount();
  const sendBalance = useSwapStoreSelectors.use.sendBalance();
  const receiveAmount = useSwapStoreSelectors.use.receiveAmount();
  const sendAmount = useSwapStoreSelectors.use.sendAmount();
  const setFocus = useSwapStoreSelectors.use.setFocus();
  const getQuoteAmount = useSwapStoreSelectors.use.getQuoteAmount();
  const isFetching = useSwapStoreSelectors.use.isFetching();
  const getBalance = useSwapStoreSelectors.use.getBalance();
  const inputFocus = useSwapStoreSelectors.use.inputFocus();
  const getQuoteAmountDebounced = useDebouncedCallback(getQuoteAmount, 1000);

  useEffect(() => {
    if (status === "authenticated") getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex justify-between max-w-md w-full">
        <button
          onClick={getQuoteAmount}
          className="bg-primary-foreground p-1 rounded-full mb-1 ml-1"
        >
          <ReloadIcon />
        </button>
      </div>
      <div className="border p-4 rounded-2xl max-w-md w-full space-y-4 bg-primary-foreground relative">
        <SwapInput
          isLoading={isFetching === "loading" && inputFocus === "receive"}
          onFocus={() => setFocus(InputFocusEnum.send)}
          onChange={(e) => {
            setSendAmount(e.target.value);
            if (+e.target.value) {
              getQuoteAmountDebounced();
            } else {
              setReceiveAmount("0");
            }
          }}
          value={sendAmount}
          onTokenChange={(token: CompleteToken) => {
            setSendToken(token);
            getQuoteAmountDebounced();
          }}
          tokens={tokens}
          selectedToken={sendToken}
          inputHeader={
            <div className="pb-2 flex justify-between items-center">
              <p className="font-medium text-sm">You are paying</p>
              <div className="flex items-center gap-1 mr-2">
                {typeof +sendBalance === "number" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mr-3">
                    <Wallet className="w-3 h-3" />
                    {+sendBalance} {sendToken.symbol}
                  </div>
                )}
                <button
                  className="text-[10px] hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
                  onClick={() => {
                    if (+sendBalance) {
                      setSendAmount(`${+sendBalance / 2}`);
                      getQuoteAmount();
                    }
                  }}
                >
                  Half
                </button>
                <button
                  onClick={() => {
                    if (+sendBalance) {
                      setSendAmount(`${+sendBalance}`);
                      getQuoteAmount();
                    }
                  }}
                  className="text-[10px] hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
                >
                  Max
                </button>
              </div>
            </div>
          }
        />
        <div className="py-4">
          <button
            disabled={isFetching === "loading"}
            className="border-b-2 w-full relative cursor-pointer"
            onClick={() => {
              onArrayUpDownClick();
              getQuoteAmount();
            }}
          >
            <div className=" w-full absolute -translate-y-1/2">
              <ArrowUpDown className="flex justify-center items-center mx-auto bg-primary-foreground p-2 rounded-full border-2 w-9 h-9" />
            </div>
          </button>
        </div>
        <SwapInput
          isLoading={
            isFetching === "loading" && inputFocus === InputFocusEnum.send
          }
          onFocus={() => setFocus(InputFocusEnum.receive)}
          onChange={(e) => {
            setReceiveAmount(e.target.value);
            if (+e.target.value) {
              getQuoteAmountDebounced();
            } else {
              setSendAmount("0");
            }
          }}
          value={receiveAmount}
          inputHeader={
            <div className="pb-2 flex justify-between items-center">
              <p className="font-medium text-sm">To receive</p>
              {typeof +receiveBalance === "number" && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs mr-3">
                  <Wallet className="w-3 h-3" />
                  {+receiveBalance} {receiveToken.symbol}
                </div>
              )}
            </div>
          }
          onTokenChange={(token: CompleteToken) => {
            setReceiveToken(token);
            getQuoteAmount();
          }}
          tokens={tokens}
          selectedToken={receiveToken}
        />
        {status === "unauthenticated" && <LoginSignupModal showOauth />}
        {status === "authenticated" && !tokenTransfer && <OnBoardingModal />}
        {(tokenTransfer === "success" || tokenTransfer === "error") &&
          status === "authenticated" && <TokenTransferredModal />}
        {status === "authenticated" && (
          <Button
            disabled={isFetching === "loading"}
            onClick={() => {
              const isSendNumber =
                typeof +sendAmount === "number" && +sendAmount > 0;
              const isReceiveNumber =
                typeof +receiveAmount === "number" && +receiveAmount > 0;

              if (isSendNumber && isReceiveNumber) {
                setConfirmation(true);
              }
            }}
            size="lg"
            className="w-full rounded-2xl"
          >
            Confirm
          </Button>
        )}
        <SwapConfirmationModal open={confirmation} setOpen={setConfirmation} />
      </div>
    </div>
  );
};

export default SwapDetails;
