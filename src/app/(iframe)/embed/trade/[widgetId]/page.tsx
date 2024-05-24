import { server } from "@/trpc/server/api";
import { WidgetTabs } from "./components/WidgetTabs";

const Page = async ({ params }: { params: { widgetId?: string } }) => {
  const { widget } = await server.widgets.getWidgetById.query({
    id: params.widgetId ?? "",
  });
  const { tokens } = await server.tokens.getAllTokens.query();

  if (widget?.id) {
    return <WidgetTabs tokens={tokens} widget={widget} />;
  }

  return <>Page not found</>;
};

export default Page;
