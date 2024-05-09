"use client";

import LoginModal from "@/components/auth/LoginModal";
import { Button } from "@/components/ui/button";
import { SwapInput } from "@/components/ui/swap-Input";
import { ArrowRightLeft, ArrowUpDown } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Page() {
  const { status } = useSession();

  return (
    <div className="flex min-h-screen overflow-y-auto flex-col justify-center items-center ">
      <div className="border p-4 rounded-2xl max-w-md w-full space-y-4 bg-primary-foreground">
        <SwapInput />
        <div className="py-4">
          <div className="border-b-2 w-full relative">
            <div className=" w-full absolute -translate-y-1/2">
              <ArrowUpDown className="flex justify-center items-center mx-auto bg-primary-foreground p-2 rounded-full border-2 w-9 h-9" />
            </div>
          </div>
        </div>
        <SwapInput />
        {status === "unauthenticated" && <LoginModal />}
        {status === "authenticated" && (
          <Button size="lg" className="w-full rounded-2xl">
            Swap
          </Button>
        )}
      </div>
    </div>
  );
}
