/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";
import { addressShortener } from "@/utils/addressShortener";
import { CircleCheck, ExternalLink } from "lucide-react";

const TokenListModal = ({
  open,
  onChange,
  tokens,
  onTokenChange,
  selectedToken,
}: {
  open: boolean;
  onChange: (value: boolean) => void;
  tokens: CompleteToken[];
  onTokenChange: (token: CompleteToken) => void;
  selectedToken: CompleteToken;
}) => (
  <Dialog open={open} onOpenChange={onChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Token List </DialogTitle>
      </DialogHeader>
      <div>
        {tokens.map((token) => (
          <button
            onClick={() => {
              onTokenChange(token);
              onChange(false);
            }}
            className={`flex items-center justify-between my-2 border rounded-2xl p-4 cursor-pointer w-full ${
              token.address === selectedToken.address ? "bg-secondary" : ""
            } hover:bg-secondary`}
            key={token.id}
          >
            <div className="w-full">
              <div className="flex gap-2 items-center">
                <img
                  src={token.imageUrl}
                  alt="log"
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <div className="flex gap-1 items-center">
                    <div>{token.symbol}</div>
                    <a
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      href={`https://solscan.io/token/${token.address}`}
                      className="text-xs opacity-60 bg-secondary px-1 py-0.5 rounded-md flex justify-center items-center gap-2"
                    >
                      <p>{addressShortener(token.address)}</p>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-left opacity-40">{token.name}</p>
                </div>
              </div>
            </div>
            <div>
              {token.address === selectedToken.address && (
                <CircleCheck className="w-5 h-5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default TokenListModal;
