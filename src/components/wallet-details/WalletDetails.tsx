"use client";

import { trpc } from "@/lib/trpc/client";
import { Loader2 } from "lucide-react";
import { WalletTokenDetails } from "./WalletTokenDetails";
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { CompleteToken } from "@/lib/db/schema/tokens";
import { WalletSOLDetails } from "./WalletSOLDetails";

export const WalletDetails = ({ tokens }: { tokens: CompleteToken[] }) => {
  const { data, isLoading } = trpc.tokens.getAllTokensBalance.useQuery();
  const accounts = data?.accounts;
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-40">
        <Loader2 className="mr-2 h-6 w-6 animate-spin " />
      </div>
    );
  }
  if (accounts)
    return (
      <div>
        <div>
          <WalletSOLDetails />
        </div>
        {accounts.map((token, index) => (
          <WalletTokenDetails
            walletTokenDetails={
              token as {
                pubkey: PublicKey;
                account: AccountInfo<ParsedAccountData>;
              }
            }
            tokens={tokens}
            key={`${token.pubkey.toString()}${index}`}
          />
        ))}
      </div>
    );
  return <></>;
};
