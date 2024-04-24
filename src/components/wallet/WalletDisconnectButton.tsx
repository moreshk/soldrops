import React from "react";
import { BaseWalletDisconnectButton } from "./BaseWalletDisconnectButton.js";
import { ButtonProps } from "../ui/button.jsx";

const LABELS = {
  disconnecting: "Disconnecting ...",
  "has-wallet": "Disconnect",
  "no-wallet": "Disconnect Wallet",
} as const;

export function WalletDisconnectButton(props: ButtonProps) {
  return <BaseWalletDisconnectButton {...props} labels={LABELS} />;
}
