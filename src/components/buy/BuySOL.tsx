"use client";

import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export const BuySOL = ({
  successRedirectUrl,
  failureRedirectUrl,
}: {
  successRedirectUrl: string;
  failureRedirectUrl: string;
}) => {
  const { theme, systemTheme } = useTheme();
  const widgetTheme = (theme === "system" ? systemTheme : theme) || "dark";
  const { user } = useUser();
  const walletAddress = user?.publicMetadata.walletAddress as string;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Buy SOL</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <iframe
          src={`https://buy.onramper.com?apiKey=pk_prod_01HXRR2B13Q9Q7KD086MYFM28A&partnerContext=Soldrops&mode=buy&defaultCrypto=sol&onlyCryptos=sol&wallets=sol:${walletAddress}&onlyCryptoNetworks=solana&themeName=${widgetTheme}&successRedirectUrl=${encodeURI(
            successRedirectUrl
          )}&failureRedirectUrl=${encodeURI(failureRedirectUrl)}`}
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
