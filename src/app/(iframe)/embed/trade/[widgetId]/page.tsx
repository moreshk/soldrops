import { api } from "@/lib/trpc/api";
import dynamic from "next/dynamic";

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
    return <TradeWidget widget={widget} tokens={tokens} />;
  }

  return <>Page not found</>;
};

export default Page;
