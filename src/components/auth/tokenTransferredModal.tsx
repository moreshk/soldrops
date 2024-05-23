"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { trpc } from "@/lib/trpc-client/client";

const TokenTransferredModal = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const { data } = trpc.tokenBalance.getSolTokenBalance.useQuery(undefined, {
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
  const balance = data?.balance;

  const searchParams = useSearchParams();
  const tokenTransfer = searchParams.get("tokenTransfer") as
    | "success"
    | "error"
    | undefined;

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={() => {
          router.push("/swap");
          setOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <>
            <DialogHeader>
              <DialogTitle>Soldrops </DialogTitle>
            </DialogHeader>
            {tokenTransfer === "success" && (
              <div className="space-y-10 flex flex-col justify-center items-center">
                <p>Solona has arrived at your wallet</p>
                <p className="text-center text-2xl font-medium">
                  {typeof balance === "number" ? (
                    <>{balance / 1000000000} SOL</>
                  ) : (
                    <div className="w-10 h-6 rounded-lg animate-pulse bg-secondary" />
                  )}
                </p>
                <div>
                  <Link
                    className={buttonVariants({ variant: "default" })}
                    href="/buy"
                  >
                    Deposit more
                  </Link>
                </div>
                <Button variant="outline" onClick={() => router.push("/swap")}>
                  START TRADING
                </Button>
              </div>
            )}
            {tokenTransfer === "error" && (
              <div className="space-y-10 flex flex-col justify-center items-center">
                <p>Opss something went wrong</p>
                <div className="text-center text-2xl font-medium">
                  {typeof balance === "number" ? (
                    <p>{balance / 1000000000} SOL</p>
                  ) : (
                    <div className="w-10 h-6 rounded-lg animate-pulse bg-secondary" />
                  )}
                </div>
                <div>
                  <Link
                    className={buttonVariants({ variant: "default" })}
                    href="/buy"
                  >
                    Try again
                  </Link>
                </div>
                <Button variant="outline" onClick={() => router.push("/swap")}>
                  START TRADING
                </Button>
              </div>
            )}
          </>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokenTransferredModal;
