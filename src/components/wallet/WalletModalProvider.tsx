"use client";
import type { FC, ReactNode } from "react";
import React, { useMemo, useState } from "react";
import { WalletModalContext } from "./useWalletModal";
import type { WalletModalProps } from "./WalletModal";
import { WalletModal } from "./WalletModal";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import * as AllWalletAdapters from "@solana/wallet-adapter-wallets";

const {
  UnsafeBurnerWalletAdapter: _,
  WalletConnectWalletAdapter,
  ...allwalletAdatpers
} = AllWalletAdapters;

export interface WalletModalProviderProps extends WalletModalProps {
  children: ReactNode;
}

export const ConnectWalletProvider: FC<WalletModalProviderProps> = ({
  children,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const endpoint =
    "https://multi-wiser-sponge.solana-mainnet.quiknode.pro/26d3156efb1255e9810b3aa12d197d6d73414636/";
  const wallets = useMemo(() => {
    const walletAdapters = Object.keys(allwalletAdatpers)
      .filter((key) => key.includes("Adapter"))
      .map((key) => new (allwalletAdatpers as any)[key]());

    return walletAdapters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalContext.Provider
          value={{
            visible,
            setVisible,
          }}
        >
          {children}
          <WalletModal {...props} />
        </WalletModalContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
