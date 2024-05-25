"use client";

import { BuySOL } from "@/components/buy/BuySOL";

const Buy = () => {
  return (
    <BuySOL
      failureRedirectUrl={`${process.env
        .NEXT_PUBLIC_URL!}/buy?tokenTransfer=error`}
      successRedirectUrl={`${process.env
        .NEXT_PUBLIC_URL!}/buy/tokenTransfer=success`}
    />
  );
};

export default Buy;
