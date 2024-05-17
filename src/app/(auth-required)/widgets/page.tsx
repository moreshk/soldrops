import WidgetList from "@/components/widgets/WidgetList";
import NewWidgetModal from "@/components/widgets/WidgetModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Widgets() {
  await checkAuth();
  const { widgets } = await api.widgets.getWidgets.query();
  const { tokens } = await api.tokens.getAllTokens.query();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Widgets</h1>
        <NewWidgetModal emptyState tokens={tokens} />
      </div>
      <WidgetList widgets={widgets} tokens={tokens} />
    </main>
  );
}
