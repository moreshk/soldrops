"use client";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { WalletModalButton } from "../wallet/WalletModalButton";
import { BaseWalletMultiButton } from "../wallet/BaseWalletMultiButton";
import { useWallet } from "@solana/wallet-adapter-react";

export const Login = () => {
  const { data: session, status } = useSession();
  const { connected } = useWallet();

  return (
    <div className="pt-10">
      {status === "loading" && (
        <div className="w-36 rounded-md animate-pulse h-10 bg-primary/10" />
      )}
      {status === "authenticated" && (
        <div>
          {connected ? (
            <BaseWalletMultiButton
              labels={{
                "change-wallet": "Change Wallet",
                "copy-address": "Copy address",
                "has-wallet": "Has Wallet",
                "no-wallet": "No Wallet",
                connecting: "Connecting...",
                disconnect: "Disconnect",
              }}
            />
          ) : (
            <WalletModalButton />
          )}
        </div>
      )}

      {status === "unauthenticated" && (
        <Button onClick={() => signIn()}>Connect Twitter</Button>
      )}
    </div>
  );
};
