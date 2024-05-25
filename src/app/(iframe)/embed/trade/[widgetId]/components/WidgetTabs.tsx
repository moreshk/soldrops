/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnBoarding } from "@/components/onboarding-flow/OnBoarding";
import { WalletDetails } from "@/components/wallet-details/WalletDetails";
import { SignedIn } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";
import { CompleteWidget } from "@/trpc/server/actions/widgets/widgets.type";
import { useEffect, useState } from "react";
import { solToken } from "@/utils/defaultTokens";
import { useTradeStoreSelectors } from "@/store/trade-store";

const TradeWidget = dynamic(
  () => import("@/components/trade-widget/TradeWidget"),
  {
    ssr: false,
  }
);

export const WidgetTabs = ({
  tokens,
  widget,
}: {
  tokens: CompleteToken[];
  widget: CompleteWidget;
}) => {
  const [tab, setTab] = useState("swap");
  const setReceiveToken = useTradeStoreSelectors.use.setReceiveToken();

  useEffect(() => {
    setReceiveToken(widget.token);
  }, []);

  const swapTab = () => setTab("swap");
  const buyTab = () => setTab("buy");
  const walletTab = () => setTab("wallet");

  return (
    <Tabs defaultValue="swap" value={tab} className="max-w-lg w-full p-4">
      <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          onClick={swapTab}
          className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          value="swap"
        >
          Swap
        </TabsTrigger>
        <TabsTrigger
          onClick={buyTab}
          value="buy"
          className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Deposit
        </TabsTrigger>
        <TabsTrigger
          onClick={walletTab}
          value="wallet"
          className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Wallet
        </TabsTrigger>
      </TabsList>
      <TabsContent value="buy">
        <div className="border p-4 rounded-xl mt-6">
          <SignedIn>
            <OnBoarding />
          </SignedIn>
        </div>
      </TabsContent>
      <TabsContent value="swap">
        <div className="mt-6">
          <TradeWidget widget={widget} tokens={tokens} />
        </div>
      </TabsContent>
      <TabsContent value="wallet">
        <div className="border rounded-xl mt-6">
          <SignedIn>
            <WalletDetails swapTab={swapTab} tokens={tokens} />
          </SignedIn>
        </div>
      </TabsContent>
    </Tabs>
  );
};
