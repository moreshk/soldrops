/* eslint-disable @next/next/no-img-element */
"use client";
import { trpc } from "@/trpc/client/api";
import WidgetModal from "./WidgetModal";
import { Button, buttonVariants } from "../ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { CompleteWidget } from "@/trpc/server/actions/widgets/widgets.type";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";
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
        <div className="mt-2">Fee wallet {widget.feeWalletAddress}</div>
        <div className="mt-2">Commissions {widget.feePercentage}%</div>
        <div className="p-3 mt-4 border border-dashed rounded-2xl">
          <div>Embeddings Code</div>
          <div className="flex gap-3 items-center  mt-2">
            <div className="border rounded-xl p-2">
              {`<iframe src="${process.env.NEXT_PUBLIC_URL}/embed/trade/${widget.id}" width="100%" height="600px" style="border:none;"></iframe>`}
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
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-3 mt-4 border border-dashed rounded-2xl">
          <div>Link</div>
          <div className="flex gap-3 items-center  mt-2">
            <div className="border rounded-xl p-2">
              {process.env.NEXT_PUBLIC_URL}/embed/trade/{widget.id}
            </div>
            <a
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_URL}/embed/trade/${widget.id}`}
              className={`${buttonVariants({
                variant: "outline",
              })} flex-shrink-0`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
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
