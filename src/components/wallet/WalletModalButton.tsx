import type { FC, MouseEventHandler } from "react";
import React, { useCallback } from "react";
import { BaseWalletConnectionButton } from "./BaseWalletConnectionButton";
import { useWalletModal } from "./useWalletModal";

export const WalletModalButton: FC = () => {
  const { setVisible } = useWalletModal();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) setVisible(true);
    },
    [setVisible]
  );

  return (
    <BaseWalletConnectionButton onClick={handleClick}>
      Select Wallet
    </BaseWalletConnectionButton>
  );
};
