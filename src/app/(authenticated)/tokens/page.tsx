import TokenList from "@/components/tokens/TokenList";
import NewTokenModal from "@/components/tokens/TokenModal";
import { server } from "@/trpc/server/api";

export default async function Tokens() {
  const { tokens } = await server.tokens.getUsersTokens.query();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Tokens</h1>
        <NewTokenModal emptyState />
      </div>
      <TokenList tokens={tokens} />
    </main>
  );
}
