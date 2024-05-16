import { trpc } from "@/lib/trpc/client";

export const useSPLTokenBalance = (fetchStatus: boolean, address: string) => {
  const {
    data: t,
    isLoading,
    isError,
  } = trpc.tokens.getSolTokenBalance.useQuery(undefined, {
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    enabled: fetchStatus,
  });
  const balance = t?.balance;
  return { balance, isLoading: isLoading, isError };
};
