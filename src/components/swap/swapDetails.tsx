"use client";

import { ArrowUpDown, Loader2 } from "lucide-react";
import { SwapInput } from "../ui/swap-Input";
import LoginModal from "../auth/LoginModal";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { CompleteToken } from "@/lib/db/schema/tokens";
import { trpc } from "@/lib/trpc/client";
import { useSwapStoreSelectors } from "@/store/swap-store";
import { useDebouncedCallback } from "use-debounce";
import { ReloadIcon } from "@radix-ui/react-icons";

export const SwapDetails = ({ tokens }: { tokens: CompleteToken[] }) => {
  const { status } = useSession();
  const sendToken = useSwapStoreSelectors.use.sendToken();
  const receiveToken = useSwapStoreSelectors.use.receiveToken();
  const onArrayUpDownClick = useSwapStoreSelectors.use.onArrayUpDownClick();
  const setReceiveToken = useSwapStoreSelectors.use.setReceiveToken();
  const setSendToken = useSwapStoreSelectors.use.setSendToken();
  const setReceiveAmount = useSwapStoreSelectors.use.setReceiveAmount();
  const setSendAmount = useSwapStoreSelectors.use.setSendAmount();
  const receiveAmount = useSwapStoreSelectors.use.receiveAmount();
  const sendAmount = useSwapStoreSelectors.use.sendAmount();
  const setFocus = useSwapStoreSelectors.use.setFocus();
  const getQuoteAmount = useSwapStoreSelectors.use.getQuoteAmount();
  const getQuoteTokenURL = useSwapStoreSelectors.use.getQuoteTokenURL();
  const isFetching = useSwapStoreSelectors.use.isFetching();
  const inputFocus = useSwapStoreSelectors.use.inputFocus();
  const getQuoteAmountDebounced = useDebouncedCallback(getQuoteAmount, 1000);
  const { mutate: swapToken, isLoading: isTokenSwapping } =
    trpc.tokens.swapToken.useMutation({
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  return (
    <div className="flex min-h-screen overflow-y-auto flex-col justify-center items-center ">
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
          isLoading={
            (isFetching === "loading" && inputFocus === "receive") ||
            isTokenSwapping
          }
          onFocus={() => setFocus("send")}
          onChange={(e) => {
            setSendAmount(e.target.value);
            getQuoteAmountDebounced();
          }}
          value={sendAmount}
          onTokenChange={(token: CompleteToken) => {
            setSendToken(token);
            getQuoteAmountDebounced();
          }}
          tokens={tokens}
          selectedToken={sendToken}
          inputHeader={
            <div className="pb-1">
              <p className="font-medium text-sm">You are paying</p>
            </div>
          }
        />
        <div className="py-4">
          <button
            disabled={isTokenSwapping || isFetching === "loading"}
            className="border-b-2 w-full relative cursor-pointer"
            onClick={() => {
              onArrayUpDownClick();
              getQuoteAmountDebounced();
            }}
          >
            <div className=" w-full absolute -translate-y-1/2">
              <ArrowUpDown className="flex justify-center items-center mx-auto bg-primary-foreground p-2 rounded-full border-2 w-9 h-9" />
            </div>
          </button>
        </div>
        <SwapInput
          isLoading={
            (isFetching === "loading" && inputFocus === "send") ||
            isTokenSwapping
          }
          onFocus={() => setFocus("receive")}
          onChange={(e) => {
            setReceiveAmount(e.target.value);
            getQuoteAmount();
          }}
          value={receiveAmount}
          inputHeader={
            <div className="pb-1 ">
              <p className="font-medium text-sm">To receive</p>
            </div>
          }
          onTokenChange={(token: CompleteToken) => {
            setReceiveToken(token);
            getQuoteAmount();
          }}
          tokens={tokens}
          selectedToken={receiveToken}
        />
        {status === "unauthenticated" && <LoginModal />}
        {status === "authenticated" && (
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
        )}
      </div>
    </div>
  );
};
