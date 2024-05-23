import { api } from "@/lib/trpc/api";
import dynamic from "next/dynamic";
const SwapDetails = dynamic(() => import("@/components/swap/swapDetails"), {
  ssr: false,
});

const Page = async () => {
  const { tokens } = await api.tokens.getAllTokens.query();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Swap</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <SwapDetails tokens={tokens} />
      </div>
    </main>
  );
};
export default Page;
