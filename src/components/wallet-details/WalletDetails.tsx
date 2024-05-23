"use client";

import { trpc } from "@/lib/trpc/client";
import { Loader2 } from "lucide-react";
import { WalletSPLTokenDetails } from "./WalletSPLTokenDetails";
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { CompleteToken } from "@/lib/db/schema/tokens";
import { WalletSOLDetails } from "./WalletSOLDetails";
import { useState } from "react";
import { SendSPLToken } from "./SendSPLToken";
import { SendSol } from "./SendSOL";

export type TypeWalletTokenDetails = {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
};

export type TypeSelectedToken = {
  walletTokenDetails: TypeWalletTokenDetails;
  tokenDetails: CompleteToken;
};

export const WalletDetails = ({ tokens }: { tokens: CompleteToken[] }) => {
  const [sendSol, setSendSol] = useState<{ show: boolean; amount: number }>({
    show: false,
    amount: 0,
  });
  const [sendSPLTokenDetails, setSendSPLTokenDetails] = useState<
    TypeSelectedToken | undefined
  >();
  const { data, isLoading } = trpc.tokens.getAllTokensBalance.useQuery(
    undefined,
    {
      refetchInterval: 60000,
      refetchOnMount: false,
    }
  );
  const accounts = data?.accounts;
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-40">
        <Loader2 className="mr-2 h-6 w-6 animate-spin " />
      </div>
    );
  }
  if (accounts) {
    return (
      <div>
        <div>
          <WalletSOLDetails
            setShowSendSol={(amount) => setSendSol({ amount, show: true })}
          />
        </div>
        {accounts.map((token, index) => (
          <WalletSPLTokenDetails
            setSendSPLTokenDetails={setSendSPLTokenDetails}
            walletTokenDetails={token as TypeWalletTokenDetails}
            tokens={tokens}
            key={`${token.pubkey.toString()}${index}`}
          />
        ))}
        {sendSPLTokenDetails && (
          <SendSPLToken
            sendSPLTokenDetails={sendSPLTokenDetails}
            open={Boolean(sendSPLTokenDetails)}
            onClose={() => {
              setSendSPLTokenDetails(undefined);
            }}
          />
        )}
        <SendSol
          open={sendSol.show}
          maxAmount={`${sendSol.amount}`}
          onClose={() => setSendSol({ amount: 0, show: false })}
        />
      </div>
    );
  }
  return <></>;
};
