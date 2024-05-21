import { api } from "@/lib/trpc/api";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnBoarding } from "@/components/onboarding-flow/OnBoarding";
import { WalletDetails } from "@/components/wallet-details/WalletDetails";

const TradeWidget = dynamic(
  () => import("@/components/trade-widget/TradeWidget"),
  {
    ssr: false,
  }
);

const Page = async ({ params }: { params: { widgetId?: string } }) => {
  const { widget } = await api.widgets.getWidgetById.query({
    id: params.widgetId ?? "",
  });
  const { tokens } = await api.tokens.getAllTokens.query();

  if (widget?.id) {
    return (
      <Tabs defaultValue="swap" className="max-w-lg w-full p-4">
        <TabsList className="inline-flex h-9 items-center text-muted-foreground w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            value="swap"
          >
            Swap
          </TabsTrigger>
          <TabsTrigger
            value="buy"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Deposit
          </TabsTrigger>
          <TabsTrigger
            value="wallet"
            className="inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Wallet
          </TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <div className="border p-4 rounded-xl mt-6">
            <OnBoarding />
          </div>
        </TabsContent>
        <TabsContent value="swap">
          <div className="mt-6">
            <TradeWidget widget={widget} tokens={tokens} />
          </div>
        </TabsContent>
        <TabsContent value="wallet">
          <div className="border rounded-xl mt-6">
            <WalletDetails tokens={tokens} />
          </div>
        </TabsContent>
      </Tabs>
    );
  }

  return <>Page not found</>;
};

export default Page;
