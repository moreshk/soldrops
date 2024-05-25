/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { trpc } from "@/trpc/client/api";
import { toast } from "sonner";
import { addressShortener } from "@/utils/addressShortener";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTradeStoreSelectors } from "@/store/trade-store";

export const TradConfirmationModal = ({
  open,
  setOpen,
  widgetId,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  widgetId: string;
}) => {
  const [tx, setTx] = useState<string>("");
  const reset = useTradeStoreSelectors.use.reset();
  const setAmountInput = useTradeStoreSelectors.use.setAmountInput();

  const { mutate: trade, isLoading: isTokenSwapping } =
    trpc.trade.tradeToken.useMutation({
      onSuccess: (res) => {
        if (res.signature) {
          setTx(res.signature);
          setAmountInput("");
        } else {
          toast.success(res.message || "Something went wrong");
        }
      },
      onError: (err) => {
        toast.success(err.message || "Something went wrong");
      },
    });

  const amountInput = useTradeStoreSelectors.use.amountInput();
  const getQuoteTokenURL = useTradeStoreSelectors.use.getQuoteTokenURL();
  const sendToken = useTradeStoreSelectors.use.sendToken();
  const receiveToken = useTradeStoreSelectors.use.receiveToken();
  const sendAmount = useTradeStoreSelectors.use.sendAmount();
  const receiveAmount = useTradeStoreSelectors.use.receiveAmount();
  const receiveBalance = useTradeStoreSelectors.use.receiveBalance();

  return (
    <div>
      <AlertDialog open={open}>
        <AlertDialogContent className="max-w-md">
          {tx ? (
            <>
              <div className="text-center flex flex-col gap-5">
                <CheckCircle2 className="mx-auto  rounded-full w-9 h-9" />
                <div>
                  <p className="text-2xl font-semibold">Swap Confirmed!</p>
                  <p className="text-muted-foreground">
                    Your swap is confirmed and the tokens are now in your
                    account.
                  </p>
                </div>
                <div className="w-full flex border rounded-2xl justify-between items-center px-3 py-3 text-left">
                  <div className="flex gap-2 items-center">
                    <img
                      src={receiveToken.imageUrl}
                      alt="log"
                      className="w-9 h-9 rounded-full"
                    />
                    <div>
                      <div>{receiveToken.symbol}</div>
                      <div className="text-xs opacity-60">
                        {addressShortener(receiveToken.address)}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-medium">{receiveAmount}</p>
                </div>
                <Button
                  size="lg"
                  className="rounded-2xl"
                  onClick={() => {
                    setOpen(false);
                    setTx("");
                    reset();
                  }}
                >
                  Done
                </Button>
              </div>
            </>
          ) : (
            <>
              <AlertDialogHeader className="space-y-0">
                <div className="flex justify-between items-center">
                  <AlertDialogTitle>Confirmation</AlertDialogTitle>
                  <Button
                    disabled={isTokenSwapping}
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setOpen(false);
                      setTx("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </AlertDialogHeader>
              <div className="border-b" />
              <div className="py-1 text-center font-medium text-2xl">
                <p>
                  {receiveAmount} {receiveToken.symbol}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground text-sm">Swap Value</p>
                  <p className="font-semibold text-sm">${amountInput}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground text-sm">You’re Paying</p>
                  <p className="font-semibold text-sm">
                    {sendAmount} {sendToken.symbol}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground text-sm">To Receive</p>
                  <p className="font-semibold text-sm">
                    {receiveAmount} {receiveToken.symbol}
                  </p>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction
                  disabled={isTokenSwapping}
                  onClick={() => {
                    const quotedURL = getQuoteTokenURL();
                    if (quotedURL) {
                      trade({
                        quotedURL,
                        widgetId,
                        sendTokenId: sendToken.id,
                        receiveTokenId: receiveToken.id,
                      });
                    }
                  }}
                  className={`w-full  ${buttonVariants({
                    variant: "primary",
                  })}} rounded-2xl`}
                >
                  {isTokenSwapping && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isTokenSwapping ? "Buying..." : `Buy ${receiveToken.symbol}`}
                </AlertDialogAction>
              </AlertDialogFooter>
              <div className="flex justify-between items-center text-muted-foreground font-medium text-sm">
                <p>Current {receiveToken.symbol} Balance</p>
                <p>{receiveBalance}</p>
              </div>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
