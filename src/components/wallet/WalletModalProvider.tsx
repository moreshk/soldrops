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
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
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
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => {
    const walletAdapters = Object.keys(allwalletAdatpers)
      .filter((key) => key.includes("Adapter"))
      .map((key) => new (allwalletAdatpers as any)[key]());

    return walletAdapters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

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
