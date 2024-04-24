import type { Wallet } from "@solana/wallet-adapter-react";
import type { FC, MouseEventHandler } from "react";
import React from "react";
import { WalletIcon } from "./WalletIcon";
import { Button } from "../ui/button";
import { WalletReadyState } from "@solana/wallet-adapter-base";

interface WalletMenuItemProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  wallet: Wallet;
}

export const WalletMenuItem: FC<WalletMenuItemProps> = ({
  onClick,
  wallet,
  ...props
}) => {
  return (
    <div className="flex flex-col justify-start" {...props}>
      <Button
        onClick={onClick}
        type="button"
        className="my-0.5 gap-2 flex justify-between items-center"
        variant="ghost"
      >
        <div className="flex items-center gap-2">
          <WalletIcon wallet={wallet} />
          {wallet.adapter.name}
        </div>
        <span className="text-xs text-foreground">
          {wallet.readyState === WalletReadyState.Installed && "Detected"}
        </span>
      </Button>
    </div>
  );
};
