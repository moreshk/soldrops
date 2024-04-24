import type { WalletName } from "@solana/wallet-adapter-base";
import React from "react";
import { WalletIcon } from "./WalletIcon";
import { Button, ButtonProps } from "../ui/button";

type Props = ButtonProps & {
  walletIcon?: string;
  walletName?: WalletName;
};

export function BaseWalletConnectionButton({
  walletIcon,
  walletName,
  children,
  ...props
}: Props) {
  return (
    <Button {...props} type="button">
      {walletIcon && walletName ? (
        <WalletIcon
          wallet={{ adapter: { icon: walletIcon, name: walletName } }}
        />
      ) : undefined}
      {children}
    </Button>
  );
}
