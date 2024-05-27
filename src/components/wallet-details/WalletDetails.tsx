"use client";

import { trpc } from "@/trpc/client/api";
import { Loader2, RotateCw } from "lucide-react";
import { WalletSPLTokenDetails } from "./WalletSPLTokenDetails";
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { WalletSOLDetails } from "./WalletSOLDetails";
import { useState } from "react";
import { SendSPLToken } from "./SendSPLToken";
import { SendSol } from "./SendSOL";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";

export type TypeWalletTokenDetails = {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
};

export type TypeSelectedToken = {
  walletTokenDetails: TypeWalletTokenDetails;
  tokenDetails: CompleteToken;
};

export const WalletDetails = ({
  tokens,
  swapTab,
}: {
  tokens: CompleteToken[];
  swapTab: () => void;
}) => {
  const [sendSol, setSendSol] = useState<{ show: boolean; amount: number }>({
    show: false,
    amount: 0,
  });
  const [sendSPLTokenDetails, setSendSPLTokenDetails] = useState<
    TypeSelectedToken | undefined
  >();
  const { data, isLoading, refetch, isFetching } =
    trpc.tokenBalance.getAllTokensBalance.useQuery(undefined, {
      refetchInterval: 60000,
      refetchOnMount: false,
    });

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-40">
        <Loader2 className="mr-2 h-6 w-6 animate-spin " />
      </div>
    );
  }
  if (data) {
    const accounts = data.accounts;
    const tokenPrice = data.tokenPrice;
    const solBalance = data.balance;

    return (
      <div>
        <div className="flex justify-end mr-4 mt-4">
          <button
            onClick={async () => {
              try {
                await refetch();
              } catch (e) {
                console.error(e);
              }
            }}
          >
            <RotateCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div>
          <WalletSOLDetails
            amount={solBalance}
            setShowSendSol={(amount) => setSendSol({ amount, show: true })}
            tokenPrice={tokenPrice}
            swapTab={swapTab}
          />
        </div>
        {accounts.map((token, index) => (
          <WalletSPLTokenDetails
            swapTab={swapTab}
            setSendSPLTokenDetails={setSendSPLTokenDetails}
            walletTokenDetails={token as TypeWalletTokenDetails}
            tokens={tokens}
            key={`${token.pubkey.toString()}${index}`}
            tokenPrice={tokenPrice}
          />
        ))}
        {sendSPLTokenDetails && (
          <SendSPLToken
            sendSPLTokenDetails={sendSPLTokenDetails}
            open={Boolean(sendSPLTokenDetails)}
            tokenPrice={tokenPrice}
            onClose={() => {
              setSendSPLTokenDetails(undefined);
            }}
          />
        )}
        <SendSol
          open={sendSol.show}
          maxAmount={`${sendSol.amount}`}
          tokenPrice={tokenPrice}
          onClose={() => setSendSol({ amount: 0, show: false })}
        />
      </div>
    );
  }
  return <></>;
};
