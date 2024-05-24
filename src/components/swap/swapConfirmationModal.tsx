/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowDown, BadgeCheck, ExternalLink, Loader2, X } from "lucide-react";
import { useSwapStoreSelectors } from "@/store/swap-store";
import { trpc } from "@/trpc/client/api";
import { toast } from "sonner";
import { addressShortener } from "@/utils/addressShortener";

export const SwapConfirmationModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [tx, setTx] = useState<string>("");
  const { mutate: swapToken, isLoading: isTokenSwapping } =
    trpc.swap.swapToken.useMutation({
      onSuccess: (res) => {
        if (res.signature) {
          setTx(res.signature);
        } else {
          toast.success(res.message || "Something went wrong");
        }
      },
      onError: (err) => {
        toast.success(err.message || "Something went wrong");
      },
    });

  const getQuoteAmount = useSwapStoreSelectors.use.getQuoteAmount();
  const getQuoteTokenURL = useSwapStoreSelectors.use.getQuoteTokenURL();
  const isFetching = useSwapStoreSelectors.use.isFetching();
  const sendToken = useSwapStoreSelectors.use.sendToken();
  const receiveToken = useSwapStoreSelectors.use.receiveToken();
  const sendAmount = useSwapStoreSelectors.use.sendAmount();
  const receiveAmount = useSwapStoreSelectors.use.receiveAmount();

  return (
    <div>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex justify-between">
            <p>Confirm swap</p>
            <Button
              disabled={isTokenSwapping}
              variant="outline"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {tx ? (
            <div>
              <BadgeCheck className="w-20 h-20 bg-green-500 rounded-full mx-auto" />
              <p>you received</p>
              <div className="flex gap-3 group-hover:bg-background rounded-xl px-2 py-1.5 border items-center h-11 mb-10">
                <img
                  src={receiveToken.imageUrl}
                  alt="logo"
                  className="w-5 h-5 rounded-full"
                />
                <div className="flex gap-1 items-center">
                  <p className="font-semibold">{receiveToken.symbol}</p>
                </div>
                <p>{receiveAmount}</p>
              </div>
              <a
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                href={`https://solscan.io/tx/${tx}`}
                className="px-1 py-0.5 flex justify-center items-center gap-2 mb-3 border rounded-xl"
              >
                Tx - <p>{addressShortener(tx)} (View on solscan)</p>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Button
                size="lg"
                variant="secondary"
                className="w-full rounded-2xl"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex flex-col gap-4 items-center">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 group-hover:bg-background rounded-xl px-2 py-1.5 border items-center h-11">
                    <img
                      src={sendToken.imageUrl}
                      alt="logo"
                      className="w-5 h-5 rounded-full"
                    />
                    <div className="flex gap-1 items-center">
                      <p className="font-semibold">{sendToken.symbol}</p>
                    </div>
                    <p>{sendAmount}</p>
                  </div>
                </div>
                <div>
                  <ArrowDown />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 group-hover:bg-background rounded-xl px-2 py-1.5 border items-center h-11">
                    <img
                      src={receiveToken.imageUrl}
                      alt="logo"
                      className="w-5 h-5 rounded-full"
                    />
                    <div className="flex gap-1 items-center">
                      <p className="font-semibold">{receiveToken.symbol}</p>
                    </div>
                    <p>{receiveAmount}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Button
                  disabled={isTokenSwapping}
                  size="lg"
                  variant="secondary"
                  className="w-full rounded-2xl"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isFetching === "loading" || isTokenSwapping}
                  onClick={async () => {
                    try {
                      getQuoteAmount();
                      const quotedURL = getQuoteTokenURL();
                      if (quotedURL) {
                        swapToken({ quotedURL });
                      }
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                  size="lg"
                  className="w-full rounded-2xl"
                >
                  {isTokenSwapping && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isTokenSwapping ? "Swapping...." : "Swap"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
