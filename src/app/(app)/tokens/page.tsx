import TokenList from "@/components/tokens/TokenList";
import NewTokenModal from "@/components/tokens/TokenModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Tokens() {
  await checkAuth();
  const { tokens } = await api.tokens.getTokens.query();  

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Tokens</h1>
        <NewTokenModal />
      </div>
      <TokenList tokens={tokens} />
    </main>
  );
}
