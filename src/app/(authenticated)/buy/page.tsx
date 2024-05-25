"use client";

import { BuySOL } from "@/components/buy/BuySOL";

const Buy = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Buy SOL</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <BuySOL
          failureRedirectUrl={`${process.env
            .NEXT_PUBLIC_URL!}/buy?tokenTransfer=error`}
          successRedirectUrl={`${process.env
            .NEXT_PUBLIC_URL!}/buy/tokenTransfer=success`}
        />
      </div>
    </main>
  );
};

export default Buy;
