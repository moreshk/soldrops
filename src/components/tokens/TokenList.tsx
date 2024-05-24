/* eslint-disable @next/next/no-img-element */
"use client";
import { trpc } from "@/trpc/client/api";
import TokenModal from "./TokenModal";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";

export default function TokenList({ tokens }: { tokens: CompleteToken[] }) {
  const { data: t } = trpc.tokens.getUsersTokens.useQuery(undefined, {
    initialData: { tokens },
    refetchOnMount: false,
  });

  if (t.tokens.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-1 justify-center rounded-lg border border-dashed shadow-sm">
      <ul className="w-full text-left p-3">
        {t.tokens.map((token) => (
          <Token token={token} key={token.id} />
        ))}
      </ul>
    </div>
  );
}

const Token = ({ token }: { token: CompleteToken }) => {
  return (
    <li className="flex justify-between my-2 border rounded-2xl p-4">
      <div className="w-full">
        <div className="flex gap-2 items-center">
          <img
            src={token.imageUrl}
            alt="log"
            className="w-9 h-9 rounded-full"
          />
          <div>
            <div>{token.symbol}</div>
            <div className="text-xs opacity-60">{token.address}</div>
          </div>
        </div>
      </div>
      <TokenModal token={token} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No tokens
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new token.
      </p>
      <div className="mt-6">
        <TokenModal emptyState={true} />
      </div>
    </div>
  );
};
