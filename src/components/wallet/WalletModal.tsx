import type { WalletName } from "@solana/wallet-adapter-base";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import type { FC, MouseEvent } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { useWalletModal } from "./useWalletModal";
import { WalletMenuItem } from "./WalletMenuItem";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export interface WalletModalProps {
  featuredWallets?: number;
}

export const WalletModal: FC<WalletModalProps> = ({
  featuredWallets = 3,
  ...props
}) => {
  const { wallets, select } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const [expanded, setExpanded] = useState(false);

  const [featured, more] = useMemo(() => {
    const installed: Wallet[] = [];
    const notInstalled: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      } else {
        notInstalled.push(wallet);
      }
    }

    const orderedWallets = [...installed, ...notInstalled];
    return [
      orderedWallets.slice(0, featuredWallets),
      orderedWallets.slice(featuredWallets),
    ];
  }, [wallets, featuredWallets]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleWalletClick = useCallback(
    (event: MouseEvent<HTMLElement>, walletName: WalletName) => {
      select(walletName);
      handleCancel();
    },
    [select, handleCancel]
  );

  const onOpenChange = useCallback(
    () => setExpanded(!expanded),
    [setExpanded, expanded]
  );

  return (
    <Dialog open={visible} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-center items-center text-center mt-5">
          <DialogTitle className="text-center w-52 text-current">
            Connect A wallet on Solona to continue
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {featured.map((wallet) => (
            <WalletMenuItem
              key={wallet.adapter.name}
              onClick={(event) => handleWalletClick(event, wallet.adapter.name)}
              wallet={wallet}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
