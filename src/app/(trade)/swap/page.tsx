import { SwapDetails } from "@/components/swap/swapDetails";
import { api } from "@/lib/trpc/api";

const Page = async () => {
  const { tokens } = await api.tokens.getTokens.query();
  return <SwapDetails tokens={tokens} />;
};
export default Page;
