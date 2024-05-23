/* eslint-disable @next/next/no-img-element */
"use client";
import { trpc } from "@/lib/trpc-client/client";
import WidgetModal from "./WidgetModal";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { CompleteWidget } from "@/lib/trpc-api/widgets/widgets.type";
import { CompleteToken } from "@/lib/trpc-api/tokens/tokens.type";
import { addressShortener } from "@/utils/addressShortener";

export default function WidgetList({
  widgets,
  tokens,
}: {
  widgets: CompleteWidget[];
  tokens: CompleteToken[];
}) {
  const { data: w } = trpc.widgets.getWidgets.useQuery(undefined, {
    initialData: { widgets },
    refetchOnMount: false,
  });

  if (w.widgets.length === 0) {
    return <EmptyState tokens={tokens} />;
  }

  return (
    <ul>
      {w.widgets.map((widget) => (
        <Widget widget={widget} key={widget.id} tokens={tokens} />
      ))}
    </ul>
  );
}

const Widget = ({
  widget,
  tokens,
}: {
  widget: CompleteWidget;
  tokens: CompleteToken[];
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <li className="flex justify-between my- border p-4 rounded-xl my-2">
      <div className="w-full">
        <div className="flex gap-2 items-center">
          <img
            src={widget.token.imageUrl}
            alt="log"
            className="w-9 h-9 rounded-full"
          />
          <div>
            <div>{widget.token.symbol}</div>
            <div className="text-xs opacity-60">
              {addressShortener(widget.token.address)}
            </div>
          </div>
        </div>
        <div>Fee wallet {widget.feeWalletAddress}</div>
        <div>Commissions {widget.feePercentage}%</div>
        <div className="flex gap-3 items-center  mt-2">
          <div className="border rounded-xl p-2">
            {process.env.NEXT_PUBLIC_URL}/embed/trade/{widget.id}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_URL}/embed/trade/${widget.id}`
              );
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1000);
            }}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <WidgetModal widget={widget} tokens={tokens} />
    </li>
  );
};

const EmptyState = ({ tokens }: { tokens: CompleteToken[] }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No widgets
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new widget.
      </p>
      <div className="mt-6">
        <WidgetModal emptyState={true} tokens={tokens} />
      </div>
    </div>
  );
};
