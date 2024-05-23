"use client";
/* eslint-disable @next/next/no-img-element */

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { TypeSelectedToken } from "./WalletDetails";
import { SendHorizontal, Loader2, ArrowLeft } from "lucide-react";
import { addressShortener } from "@/utils/addressShortener";
import { SendTokenInputForm } from "./SendTokenInputForm";
import { trpc } from "@/lib/trpc-client/client";
import { toast } from "sonner";
import { SendTokenSuccess } from "./SendTokenSuccess";
import { SendTokenSchemaType } from "@/lib/trpc-api/trade/trade.type";

export const SendSPLToken = ({
  sendSPLTokenDetails,
  open,
  onClose,
}: {
  sendSPLTokenDetails: TypeSelectedToken;
  open: boolean;
  onClose: () => void;
}) => {
  const info = sendSPLTokenDetails.walletTokenDetails.account.data.parsed.info;
  const [sendDetails, setSendDetails] = useState<
    SendTokenSchemaType | undefined
  >();
  const [confirm, setConfirm] = useState(false);
  const [tx, setTx] = useState("");
  const { mutate: send, isLoading: isTokenSending } =
    trpc.trade.sendSPLToken.useMutation({
      onSuccess: (res) => {
        if (res.signature) {
          setTx(res.signature);
        } else {
          toast.success(res.message || "Something went wrong");
        }
      },
      onError: (err) => {
        toast.success(err.message || "Something went wrong");
      },
    });

  const onConfirm = () => {
    if (sendDetails) {
      send({
        sendAddress: sendDetails.sendAddress,
        sendAmount: `${Math.floor(
          +sendDetails.sendAmount *
            10 ** sendSPLTokenDetails.tokenDetails.decimal
        )}`,
        tokenAddress: sendSPLTokenDetails.tokenDetails.address,
      });
    }
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        {tx && sendDetails ? (
          <SendTokenSuccess
            onClose={onClose}
            sendAmount={sendDetails.sendAmount}
            sentAddress={sendDetails.sendAddress}
            tx={tx}
            symbol={sendSPLTokenDetails.tokenDetails.symbol}
          />
        ) : (
          <>
            <DrawerHeader>
              <div className="grid grid-cols-3">
                <div className="flex justify-start">
                  {confirm && (
                    <Button
                      disabled={isTokenSending}
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirm(false)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <DrawerTitle className="mt-3 text-center">
                  {confirm
                    ? `Confirm Send`
                    : `Send ${sendSPLTokenDetails.tokenDetails.symbol}`}
                </DrawerTitle>
              </div>
              {confirm ? (
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex justify-center items-center mt-5">
                  <SendHorizontal />
                </div>
              ) : (
                <img
                  src={sendSPLTokenDetails.tokenDetails.imageUrl}
                  alt="log"
                  className="w-16 h-16 rounded-full mx-auto mt-5"
                />
              )}
            </DrawerHeader>
            {confirm ? (
              <div className="text-center">
                <p className="text-2xl">
                  {sendDetails?.sendAmount}{" "}
                  {sendSPLTokenDetails.tokenDetails.symbol}
                </p>
                <p className="text-sm text-muted-foreground">
                  to {addressShortener(sendDetails?.sendAddress)}
                </p>
                <div className="bg-secondary m-4 rounded-xl ">
                  <div className="justify-between flex items-center py-3 border-b border-b-background">
                    <p className="pl-4">To</p>
                    <p className="pr-4">
                      {addressShortener(sendDetails?.sendAddress)}
                    </p>
                  </div>
                  <div className="justify-between flex items-center py-3 border-b border-b-background ">
                    <p className="pl-4">Network</p>
                    <p className="pr-4">Solana</p>
                  </div>
                </div>
              </div>
            ) : (
              <SendTokenInputForm
                sendDetails={sendDetails}
                setSendDetails={(value: SendTokenSchemaType) => {
                  setSendDetails(value);
                  setConfirm(true);
                }}
                maxAmount={info.tokenAmount.uiAmountString}
                onClose={onClose}
                symbol={sendSPLTokenDetails.tokenDetails.symbol}
              />
            )}

            {confirm && (
              <DrawerFooter>
                <div className="flex items-center gap-3">
                  <Button
                    disabled={isTokenSending}
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isTokenSending}
                    type="button"
                    className="w-full"
                    onClick={onConfirm}
                  >
                    {isTokenSending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              </DrawerFooter>
            )}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
