"use client";

import { ArrowUpDown } from "lucide-react";
import { SwapInput } from "../ui/swap-Input";
import LoginModal from "../auth/LoginModal";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { CompleteToken } from "@/lib/db/schema/tokens";
import { trpc } from "@/lib/trpc/client";
import { useSwapStoreSelectors } from "@/store/swap-store";

export const SwapDetails = ({ tokens }: { tokens: CompleteToken[] }) => {
  const { status } = useSession();
  const { data } = trpc.tokens.getTokens.useQuery(undefined, {
    initialData: { tokens },
    refetchOnMount: false,
  });
  const sendToken = useSwapStoreSelectors.use.sendToken();
  const receiveToken = useSwapStoreSelectors.use.receiveToken();
  const swapTokens = useSwapStoreSelectors.use.swapTokens();
  const setReceiveToken = useSwapStoreSelectors.use.setReceiveToken();
  const setSendToken = useSwapStoreSelectors.use.setSendToken();

  return (
    <div className="flex min-h-screen overflow-y-auto flex-col justify-center items-center ">
      <div className="border p-4 rounded-2xl max-w-md w-full space-y-4 bg-primary-foreground">
        <SwapInput
          onTokenChange={setSendToken}
          tokens={data.tokens}
          selectedToken={sendToken}
          inputHeader={
            <div className="pb-1">
              <p className="font-medium text-sm">You are paying</p>
            </div>
          }
        />
        <div className="py-4">
          <button
            className="border-b-2 w-full relative cursor-pointer"
            onClick={swapTokens}
          >
            <div className=" w-full absolute -translate-y-1/2">
              <ArrowUpDown className="flex justify-center items-center mx-auto bg-primary-foreground p-2 rounded-full border-2 w-9 h-9" />
            </div>
          </button>
        </div>
        <SwapInput
          inputHeader={
            <div className="pb-1 ">
              <p className="font-medium text-sm">To receive</p>
            </div>
          }
          onTokenChange={setReceiveToken}
          tokens={data.tokens}
          selectedToken={receiveToken}
        />
        {status === "unauthenticated" && <LoginModal />}
        {status === "authenticated" && (
          <Button size="lg" className="w-full rounded-2xl">
            Swap
          </Button>
        )}
      </div>
    </div>
  );
};
