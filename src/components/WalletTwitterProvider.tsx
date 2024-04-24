"use client";
import { useWalletConnectButton } from "@solana/wallet-adapter-base-ui";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { BaseWalletMultiButton } from "./wallet/BaseWalletMultiButton";
import Image from "next/image";

export const WalletTwitterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { buttonState } = useWalletConnectButton();
  const isWalletConnected = buttonState === "connected";

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
              <div className="flex flex-col gap-2">
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
