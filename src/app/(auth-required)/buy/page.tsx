"use client";

import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

const Buy = () => {
  const { data: session } = useSession();
  const { theme, systemTheme } = useTheme();
  const widgetTheme = (theme === "system" ? systemTheme : theme) || "dark";

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Buy SOL</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
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
    </main>
  );
};

export default Buy;
