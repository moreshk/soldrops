/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useTradeStoreSelectors } from "@/store/trade-store";
import { ArrowUpDown, ExternalLink, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { SelectToken } from "./SelectToken";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { IsFetchingEnum } from "@/store/store-types";
import { trpc } from "@/trpc/client/api";
import { TradConfirmationModal } from "./TradConfirmationModal";
import { solToken } from "@/utils/defaultTokens";
import { addressShortener } from "@/utils/addressShortener";
import OnBoardingModal from "@/components/onboarding-flow/OnBoardingModal";
import { InSufficientBalanceTooltip } from "./InSufficientBalanceTooltip";
import { DefaultAmountButton } from "./DefaultAmountButton";
import { CompleteWidget } from "@/trpc/server/actions/widgets/widgets.type";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { AuthButton } from "../auth/AuthButton";

const TradeWidget = ({
  widget,
  tokens,
}: {
  widget: CompleteWidget;
  tokens: CompleteToken[];
}) => {
  const { user, isSignedIn } = useUser();
  const walletAddress = user?.publicMetadata.walletAddress as string;
  const [confirmationModal, setConfirmationModal] = useState(false);
  window.trpc = trpc.useUtils().client;
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

  const inSufficientHalfValue = +sendBalanceInUSDC / 2 <= 0;
  const inSufficientFullValue = +sendBalanceInUSDC <= 0;

  const insufficientValue = +sendBalanceInUSDC <= +amountInput;

  useEffect(() => {
    setReceiveToken(widget.token);
    const sol = tokens.find((token) => token.address === solToken.address);
    if (sol) setSendToken(sol);
  }, []);

  useEffect(() => {
    if (isSignedIn) setLoggedIn(true);
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) getBalance();
  }, [isSignedIn]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="border p-4 rounded-2xl w-full space-y-4 bg-primary-foreground relative">
        <div className="space-y-2">
          <div className="flex mr-3 justify-between items-center ">
            <p>Enter Amount</p>
            {walletAddress && (
              <a
                target="_blank"
                href={`https://solscan.io/account/${walletAddress}#portfolio`}
                className="text-xs underline flex items-center gap-2"
              >
                Account {addressShortener(walletAddress)}
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
            <DefaultAmountButton amount={50} balance={+sendBalanceInUSDC} />
            <DefaultAmountButton amount={100} balance={+sendBalanceInUSDC} />
            <DefaultAmountButton amount={200} balance={+sendBalanceInUSDC} />
            {inSufficientHalfValue ? (
              <InSufficientBalanceTooltip
                name="Half"
                description="Insufficient Balance"
              />
            ) : (
              <button
                className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
                onClick={() => {
                  if (+sendBalanceInUSDC) {
                    setAmountInput(`${+sendBalanceInUSDC / 2 - 0.2}`);
                    getQuoteAmount();
                  }
                }}
              >
                Half
              </button>
            )}
            {inSufficientFullValue ? (
              <InSufficientBalanceTooltip
                name="Full"
                description="Insufficient Balance"
              />
            ) : (
              <button
                className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold"
                onClick={() => {
                  if (+sendBalanceInUSDC) {
                    setAmountInput(`${(+sendBalanceInUSDC - 0.2).toFixed(2)}`);
                    getQuoteAmount();
                  }
                }}
              >
                Full
              </button>
            )}
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
                    {+sendBalanceInUSDC ? ` | $${sendBalanceInUSDC} USD` : ""}
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
                        {+receiveBalanceInUSDC
                          ? ` | $${receiveBalanceInUSDC} USD`
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
          <SignedOut>
            <AuthButton />
          </SignedOut>
          <SignedIn>
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
              disabled={isFetching || insufficientValue}
              size="lg"
              className="w-full rounded-2xl"
            >
              {isFetching ? (
                "Fetching details..."
              ) : (
                <>
                  {!amountInput ? (
                    "Review Order"
                  ) : (
                    <>
                      {insufficientValue
                        ? "Insufficient Balance"
                        : "Review Order"}
                    </>
                  )}
                </>
              )}
            </Button>
          </SignedIn>
        </div>
      </div>
      <SignedIn>
        <OnBoardingModal />
      </SignedIn>
      <TradConfirmationModal
        widgetId={widget.id}
        open={confirmationModal}
        setOpen={setConfirmationModal}
      />
    </div>
  );
};

export default TradeWidget;
