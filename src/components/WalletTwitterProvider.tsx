"use client";
import { useWalletConnectButton } from "@solana/wallet-adapter-base-ui";
import React, { ReactNode, useEffect, useState } from "react";
import { BaseWalletMultiButton } from "./wallet/BaseWalletMultiButton";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { UnplugIcon } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

export const WalletTwitterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: session, update } = useSession();
  const { buttonState } = useWalletConnectButton();
  const [walletError, setWalletError] = useState(false);
  const { publicKey } = useWallet();
  const isWalletConnected =
    buttonState === "connected" &&
    session?.user?.walletAddress === publicKey?.toString();

  const onComplete = async (data?: { error?: string }) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }
    if (session) {
      await update();
      toast.success(`Account connected successfully`);
      window.location.reload();
    }
  };
  const { mutate: updateWallet, isLoading: isUpdating } =
    trpc.auth.updateUserWallet.useMutation({
      onSuccess: (res) => onComplete(),
      onError: (err) => {
        onComplete({ error: err.message });
      },
    });

  const linkWalletAddress = () => {
    const walletAddress = publicKey?.toString();
    if (walletAddress) {
      updateWallet({ walletAddress });
    }
  };

  useEffect(() => {
    if (buttonState === "connected" && publicKey) {
      if (session?.user) {
        if (session.user.walletAddress) {
          if (session.user.walletAddress !== publicKey.toString()) {
            setWalletError(true);
            toast.error(`Invalid wallet connected with twitter account`);
          }
        } else {
          linkWalletAddress();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, buttonState, session]);

  return isWalletConnected ? (
    children
  ) : (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Image width={40} height={40} src="/favicon-32x32.png" alt="logo" />
        <h1 className="relative z-10 text-lg  bg-clip-text text-transparent bg-gradient-to-b from-pink-200 to-blue-600  text-center font-sans font-bold flex">
          SolDrops
        </h1>
      </header>
      <main className="flex-1 text-center h-full justify-center items-center flex">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col justify-center items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Claim the latest and <br />
                  greatest airdrops on Solana
                </h1>
              </div>
              {isUpdating && (
                <div>
                  <p>Please wait</p>
                  <p>
                    we are Connecting you Twitter account with the wallet
                    Address
                  </p>
                </div>
              )}
              {walletError && (
                <p>
                  Invalid wallet connected with twitter account please connect{" "}
                  {session?.user.walletAddress} refresh the page
                </p>
              )}
              <div className="flex items-center gap-3">
                {session && (
                  <>
                    <Button>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs">{session?.user.name ?? ""}</p>
                      </div>
                    </Button>
                    <Button>
                      <UnplugIcon className="rotate-45" />
                    </Button>
                  </>
                )}
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
