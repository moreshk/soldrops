import { trpc } from "@/lib/trpc/client";

export const useTokenBalance = (fetchStatus: boolean) => {
  const {
    data: t,
    isLoading,
    isError,
  } = trpc.tokens.getSolTokenBalance.useQuery(undefined, {
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    enabled: fetchStatus,
  });
  const balance = t?.balance;
  return { balance, isLoading: isLoading, isError };
};
