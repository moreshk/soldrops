import React from "react";
import { BaseWalletConnectButton } from "./BaseWalletConnectButton.js";
import { ButtonProps } from "../ui/button.jsx";

const LABELS = {
  connecting: "Connecting ...",
  connected: "Connected",
  "has-wallet": "Connect",
  "no-wallet": "Connect Wallet",
} as const;

export function WalletConnectButton(props: ButtonProps) {
  return <BaseWalletConnectButton {...props} labels={LABELS} />;
}
