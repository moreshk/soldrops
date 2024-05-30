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
import { SendHorizontal, Loader2, ArrowLeft } from "lucide-react";
import { addressShortener } from "@/utils/addressShortener";
import { SendTokenInputForm } from "./SendTokenInputForm";
import { trpc } from "@/trpc/client/api";
import { toast } from "sonner";
import { SendTokenSuccess } from "./SendTokenSuccess";
import { solToken } from "@/utils/defaultTokens";
import { SendTokenSchemaType } from "@/trpc/server/actions/trade/trade.type";
import { TokenPrice } from "@/trpc/server/actions/token-balance/token-balance.type";

export const SendSol = ({
  open,
  onClose,
  maxAmount,
  tokenPrice,
  refresh,
}: {
  open: boolean;
  maxAmount: string;
  onClose: () => void;
  refresh: () => void;
  tokenPrice: TokenPrice;
}) => {
  const [sendDetails, setSendDetails] = useState<
    SendTokenSchemaType | undefined
  >();
  const [confirm, setConfirm] = useState(false);
  const [tx, setTx] = useState("");
  const { mutate: send, isLoading: isTokenSending } =
    trpc.trade.sendSol.useMutation({
      onSuccess: (res) => {
        if (res.signature) {
          setTx(res.signature);
          refresh();
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
          +sendDetails.sendAmount * 10 ** solToken.decimal
        )}`,
        tokenAddress: solToken.address,
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
            symbol={solToken.symbol}
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
                  {confirm ? `Confirm Send` : `Send ${solToken.symbol}`}
                </DrawerTitle>
              </div>
              {confirm ? (
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex justify-center items-center mt-5">
                  <SendHorizontal />
                </div>
              ) : (
                <img
                  src={solToken.imageUrl}
                  alt="log"
                  className="w-16 h-16 rounded-full mx-auto mt-5"
                />
              )}
            </DrawerHeader>
            {confirm ? (
              <div className="text-center">
                <p className="text-2xl">
                  {sendDetails?.sendAmount} {solToken.symbol}
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
                usdTokenValue={tokenPrice[solToken.address].value || 0}
                sendDetails={sendDetails}
                setSendDetails={(value: SendTokenSchemaType) => {
                  setSendDetails(value);
                  setConfirm(true);
                }}
                maxAmount={maxAmount}
                onClose={onClose}
                symbol={solToken.symbol}
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
