/* eslint-disable @next/next/no-img-element */
import { solToken } from "@/lib/tokens/utils/defaultTokens";
import { trpc } from "@/lib/trpc/client";

export const WalletSOLDetails = () => {
  const { data, isLoading } = trpc.tokens.getSolTokenBalance.useQuery();

  return (
    <div className="bg-secondary p-4 rounded-lg m-4">
      <div className="w-full">
        <div className="flex gap-2 items-center">
          <img
            src={solToken.imageUrl}
            alt="log"
            className="w-9 h-9 rounded-full"
          />
          <div>
            <div>{solToken.symbol}</div>
            <div className="text-sm opacity-60 flex gap-2 items-center">
              <>
                {isLoading ? (
                  <div className="w-14 h-3 rounded-xl bg-muted-foreground" />
                ) : (
                  <>
                    {data?.balance ? data.balance / 10 ** solToken.decimal : 0}
                  </>
                )}
              </>{" "}
              {solToken.symbol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
