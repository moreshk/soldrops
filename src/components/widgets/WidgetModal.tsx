"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import WidgetForm from "./WidgetForm";
import { CompleteToken } from "@/trpc/server/actions/tokens/tokens.type";
import { Widget } from "@/trpc/server/actions/widgets/widgets.type";

export default function WidgetModal({
  widget,
  emptyState,
  tokens,
}: {
  widget?: Widget;
  emptyState?: boolean;
  tokens: CompleteToken[];
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!widget?.id;
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {emptyState ? (
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Widget
          </Button>
        ) : (
          <Button
            variant={editing ? "ghost" : "outline"}
            size={editing ? "sm" : "icon"}
          >
            {editing ? "Edit" : "+"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "Create"} Widget</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <WidgetForm closeModal={closeModal} widget={widget} tokens={tokens} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
