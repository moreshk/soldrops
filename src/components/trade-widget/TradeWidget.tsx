/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { CompleteWidget } from "@/lib/db/schema/widgets";
import { useTradeStoreSelectors } from "@/store/trade-store";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ArrowUpDown, ExternalLink, Wallet } from "lucide-react";
import { AuthLoginSignup } from "../auth/AuthLoginSignup";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { SelectToken } from "./SelectToken";
import { CompleteToken } from "@/lib/db/schema/tokens";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { IsFetchingEnum } from "@/store/store-types";
import { trpc } from "@/lib/trpc/client";
import { TradConfirmationModal } from "./TradConfirmationModal";
import { solToken, stableUSDC } from "@/lib/tokens/utils/defaultTokens";
import { addressShortener } from "@/lib/tokens/utils/addressShortener";
import OnBoardingModal from "@/components/onboarding-flow/OnBoardingModal";

const TradeWidget = ({
  widget,
  tokens,
}: {
  widget: CompleteWidget;
  tokens: CompleteToken[];
}) => {
  const [confirmationModal, setConfirmationModal] = useState(false);
  window.trpc = trpc.useUtils().client;
  const { status, data } = useSession();
  const amountInput = useTradeStoreSelectors.use.amountInput();
  const setLoggedIn = useTradeStoreSelectors.use.setLoggedIn();
  const sendBalance = useTradeStoreSelectors.use.sendBalance();
  const setAmountInput = useTradeStoreSelectors.use.setAmountInput();
  const receiveBalance = useTradeStoreSelectors.use.receiveBalance();
  const setSendToken = useTradeStoreSelectors.use.setSendToken();
  const setReceiveToken = useTradeStoreSelectors.use.setReceiveToken();
  const sendAmount = useTradeStoreSelectors.use.sendAmount();
  const receiveAmount = useTradeStoreSelectors.use.receiveAmount();
  const sendToken = useTradeStoreSelectors.use.sendToken();
  const isFetching =
    useTradeStoreSelectors.use.isFetching() === IsFetchingEnum.loading;
  const onArrayUpDownClick = useTradeStoreSelectors.use.onArrayUpDownClick();
  const receiveToken = useTradeStoreSelectors.use.receiveToken();
  const sendBalanceInUSDC = useTradeStoreSelectors.use.sendBalanceInUSDC();
  const receiveBalanceInUSDC =
    useTradeStoreSelectors.use.receiveBalanceInUSDC();
  const getQuoteAmount = useTradeStoreSelectors.use.getQuoteAmount();
  const getBalance = useTradeStoreSelectors.use.getBalance();
  const getQuoteAmountDebounced = useDebouncedCallback(getQuoteAmount, 1000);

  useEffect(() => {
    setReceiveToken(widget.token);
    const sol = tokens.find((token) => token.address === solToken.address);
    if (sol) setSendToken(sol);
  }, []);

  useEffect(() => {
    if (status === "authenticated") setLoggedIn(status === "authenticated");
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="border p-4 rounded-2xl max-w-md w-full space-y-4 bg-primary-foreground relative">
        <div className="space-y-2">
          <div className="flex mr-3 justify-between items-center ">
            <p>Enter Amount</p>
            {data?.user.walletAddress && (
              <a
                target="_blank"
                href={`https://solscan.io/account/${data?.user.walletAddress}#portfolio`}
                className="text-xs underline flex items-center gap-2"
              >
                Account {addressShortener(data.user.walletAddress)}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="relative group border border-input flex rounded-2xl bg-background items-center gap-2 pl-3 h-[72px] ">
            <p className="text-2xl font-medium">$</p>
            <input
              className="flex rounded-2xl px-2 flex-1  placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-xl bg-background font-medium w-full pr-4 h-16"
              value={amountInput}
              placeholder="0.00"
              onChange={(e) => {
                setAmountInput(e.target.value);
                if (+e.target.value) {
                  getQuoteAmountDebounced();
                }
              }}
            />
          </div>
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => {
                setAmountInput("50");
                getQuoteAmount();
              }}
              className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
            >
              $50
            </button>
            <button
              onClick={() => {
                setAmountInput("100");
                getQuoteAmount();
              }}
              className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
            >
              $100
            </button>
            <button
              onClick={() => {
                setAmountInput("500");
                getQuoteAmount();
              }}
              className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
            >
              $500
            </button>
            <button className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold">
              Half
            </button>
            <button className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold">
              Max
            </button>
          </div>
        </div>
        <div>
          <div className="pb-2 flex justify-between items-center">
            <p className="font-medium text-sm">You are paying</p>
            {typeof +sendBalance === "number" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mr-3">
                <Wallet className="w-3 h-3" />
                {isFetching ? (
                  <div className="w-16 h-4 bg-secondary rounded-lg " />
                ) : (
                  <p>
                    {+sendBalance} {sendToken.symbol}
                    {sendBalanceInUSDC ? `| $${sendBalanceInUSDC}` : ""}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="relative group border border-input flex rounded-2xl items-center gap-2 pl-3 h-[72px]">
            <SelectToken
              isLoading={isFetching}
              onTokenChange={(token) => {
                setSendToken(token);
                getQuoteAmountDebounced();
              }}
              selectedToken={sendToken}
              tokens={tokens}
            />
            <p className="font-medium text-xl text-right w-full mr-3">
              {sendAmount || "0.00"}
            </p>
            {isFetching && (
              <div className="absolute right-3 top-4 h-10 w-60 bg-secondary rounded-lg" />
            )}
          </div>
          <div className="py-4">
            <button
              disabled={isFetching}
              className="border-b-2 w-full relative cursor-pointer"
              onClick={() => onArrayUpDownClick()}
            >
              <div className=" w-full absolute -translate-y-1/2">
                <ArrowUpDown className="flex justify-center items-center mx-auto bg-primary-foreground p-2 rounded-full border-2 w-9 h-9" />
              </div>
            </button>
          </div>
          <div>
            <div className="pb-2 flex justify-between items-center">
              <p className="font-medium text-sm">To receive</p>
              <div className="flex justify-end mr-3 items-center gap-2">
                {typeof +receiveBalance === "number" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wallet className="w-3 h-3" />
                    {isFetching ? (
                      <div className="w-16 h-4 bg-secondary rounded-lg " />
                    ) : (
                      <p>
                        {+receiveBalance} {receiveToken.symbol}
                        {receiveBalanceInUSDC
                          ? `| $${receiveBalanceInUSDC}`
                          : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="relative group border border-input flex rounded-2xl items-center gap-2 pl-3 h-[72px]">
              <SelectToken
                isLoading={isFetching}
                onTokenChange={(token) => {
                  setReceiveToken(token);
                  getQuoteAmountDebounced();
                }}
                selectedToken={receiveToken}
                tokens={tokens}
              />
              <p className="font-medium text-xl text-right w-full mr-3">
                {receiveAmount || "0.00"}
              </p>
              {isFetching && (
                <div className="absolute right-3 top-4 h-10 w-60 bg-secondary rounded-lg" />
              )}
            </div>
          </div>
        </div>
        <div>
          {status === "unauthenticated" && <AuthLoginSignup />}
          {status === "authenticated" && (
            <Button
              onClick={() => {
                const isSendNumber =
                  typeof +sendAmount === "number" && +sendAmount > 0;
                const isReceiveNumber =
                  typeof +receiveAmount === "number" && +receiveAmount > 0;
                if (isSendNumber && isReceiveNumber) {
                  setConfirmationModal(true);
                }
              }}
              disabled={isFetching}
              size="lg"
              className="w-full rounded-2xl"
            >
              {isFetching ? "Fetching details..." : "Review Order"}
            </Button>
          )}
        </div>
      </div>
      {status === "authenticated" && <OnBoardingModal />}
      <TradConfirmationModal
        widgetId={widget.id}
        open={confirmationModal}
        setOpen={setConfirmationModal}
      />
    </div>
  );
};

export default TradeWidget;
