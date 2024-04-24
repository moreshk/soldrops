import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import React, { useMemo } from "react";
import { useWalletModal } from "./useWalletModal";
import { Button, ButtonProps } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletIcon } from "./WalletIcon";

type Props = ButtonProps & {
  labels: Omit<
    {
      [TButtonState in ReturnType<
        typeof useWalletMultiButton
      >["buttonState"]]: string;
    },
    "connected" | "disconnecting"
  > & {
    "copy-address": string;
    "change-wallet": string;
    disconnect: string;
  };
};

export function BaseWalletMultiButton({ children, labels, ...props }: Props) {
  const { setVisible: setModalVisible } = useWalletModal();
  const {
    buttonState,
    onConnect,
    onDisconnect,
    publicKey,
    walletIcon,
    walletName,
  } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true);
    },
  });
  const content = useMemo(() => {
    if (children) {
      return children;
    } else if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + ".." + base58.slice(-4);
    } else if (buttonState === "connecting" || buttonState === "has-wallet") {
      return labels[buttonState];
    } else {
      return labels["no-wallet"];
    }
  }, [buttonState, children, labels, publicKey]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {walletName && walletIcon && (
            <WalletIcon
              wallet={{ adapter: { icon: walletIcon, name: walletName } }}
            />
          )}
          {content}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {publicKey ? (
            <DropdownMenuItem>
              <span
                onClick={async () => {
                  await navigator.clipboard.writeText(publicKey?.toBase58());
                }}
              >
                {labels["copy-address"]}
              </span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            onClick={() => setTimeout(() => setModalVisible(true), 100)}
          >
            {labels["change-wallet"]}
          </DropdownMenuItem>
          {onDisconnect && (
            <DropdownMenuItem onClick={onDisconnect}>
              <span> {labels["disconnect"]}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
