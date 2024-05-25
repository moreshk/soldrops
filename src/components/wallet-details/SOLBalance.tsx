/* eslint-disable @next/next/no-img-element */

"use client";

import { trpc } from "@/trpc/client/api";
import { solToken } from "@/utils/defaultTokens";
import { useUser } from "@clerk/nextjs";

export const SolBalance = () => {
  const { isSignedIn } = useUser();
  const { data } = trpc.tokenBalance.getSolTokenBalance.useQuery(undefined, {
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    enabled: isSignedIn,
  });
  const balance = data?.balance;

  return (
    <div>
      {data && (
        <div className="flex gap-1 border rounded-full py-1.5 px-3 items-center">
          <img
            className="rounded-full w-5 h-5"
            src={solToken.imageUrl}
            alt="sol token image"
          />
          <p className="text-sm">
            {(balance ? balance / 10 ** solToken.decimal : 0).toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};
