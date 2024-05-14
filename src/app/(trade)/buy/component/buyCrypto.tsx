"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export const BuyCrypto = () => {
  const { data: session } = useSession();
  const { theme, systemTheme } = useTheme();
  const widgetTheme = (theme === "system" ? systemTheme : theme) || "dark";

  return (
    <div className="flex justify-center items-center flex-col gap-10">
      <p className="font-bold text-4xl">Soldrops</p>
      <p className="font-bold text-4xl">Buy crypto</p>
      <iframe
        src={`https://buy.onramper.com?apiKey=pk_prod_01HXRR2B13Q9Q7KD086MYFM28A&partnerContext=Soldrops&mode=buy&defaultCrypto=sol&onlyCryptos=sol&wallets=sol:${
          session?.user.walletAddress
        }&onlyCryptoNetworks=solana&themeName=${widgetTheme}&successRedirectUrl=${encodeURI(
          `${process.env.NEXT_PUBLIC_URL!}/swap?tokenTransfer=success`
        )}&failureRedirectUrl=${encodeURI(
          `${process.env.NEXT_PUBLIC_URL!}/swap?tokenTransfer=error`
        )}`}
        title="Soldrops"
        height="630px"
        className=" rounded-xl"
        width="420px"
        allow="accelerometer; autoplay; camera; gyroscope; payment"
      />
    </div>
  );
};
