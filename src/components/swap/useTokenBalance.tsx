import { trpc } from "@/lib/trpc/client";

export const useTokenBalance = (fetchStatus: boolean) => {
  const {
    data: t,
    isFetching,
    isLoading,
    isError,
  } = trpc.tokens.getTokenBalance.useQuery(undefined, {
    refetchInterval: 15000,
    enabled: fetchStatus,
  });
  const balance = t?.balance;
  return { balance, isLoading: isFetching || isLoading, isError };
};
