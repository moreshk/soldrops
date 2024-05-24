import WidgetList from "@/components/widgets/WidgetList";
import NewWidgetModal from "@/components/widgets/WidgetModal";
import { server } from "@/trpc/server/api";
import { SignedIn } from "@clerk/nextjs";

export default async function Widgets() {
  const { widgets } = await server.widgets.getWidgets.query();
  const { tokens } = await server.tokens.getAllTokens.query();

  return (
    <SignedIn>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Widgets</h1>
          <NewWidgetModal emptyState tokens={tokens} />
        </div>
        <WidgetList widgets={widgets} tokens={tokens} />
      </main>
    </SignedIn>
  );
}
