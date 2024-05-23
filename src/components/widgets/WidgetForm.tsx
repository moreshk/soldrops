/* eslint-disable @next/next/no-img-element */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc-client/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { addressShortener } from "@/utils/addressShortener";
import { CompleteToken } from "@/lib/trpc-api/tokens/tokens.type";
import {
  NewWidgetParams,
  Widget,
  insertWidgetParams,
} from "@/lib/trpc-api/widgets/widgets.type";

const WidgetForm = ({
  widget,
  closeModal,
  tokens = [],
}: {
  tokens: CompleteToken[];
  widget?: Widget;
  closeModal?: () => void;
}) => {
  const editing = !!widget?.id;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertWidgetParams>>({
    resolver: zodResolver(insertWidgetParams),
    defaultValues: widget ?? {
      feeWalletAddress: "",
      tokenId: "",
    },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    await utils.widgets.getWidgets.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Widget ${action}d!`);
  };

  const { mutate: createWidget, isLoading: isCreating } =
    trpc.widgets.createWidget.useMutation({
      onSuccess: (res) => onSuccess("create"),
      onError: (err) => {
        onSuccess("create", { error: err.message });
      },
    });

  const { mutate: updateWidget, isLoading: isUpdating } =
    trpc.widgets.updateWidget.useMutation({
      onSuccess: (res) => onSuccess("update"),
      onError: (err) => onSuccess("update", { error: err.message }),
    });

  const { mutate: deleteWidget, isLoading: isDeleting } =
    trpc.widgets.deleteWidget.useMutation({
      onSuccess: (res) => onSuccess("delete"),
      onError: (err) => onSuccess("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewWidgetParams) => {
    if (editing) {
      updateWidget({ ...values, id: widget.id });
    } else {
      createWidget(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="feeWalletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee Wallet Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenId"
          render={({ field: { value, onChange } }) => {
            const selectedToken = tokens.find((token) => token.id === value);
            return (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <div>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full text-left justify-start"
                        >
                          {selectedToken ? (
                            <div className="flex gap-2 items-center flex-1">
                              <img
                                src={selectedToken.imageUrl}
                                alt="log"
                                className="w-9 h-9 rounded-full"
                              />
                              <div>
                                <div>{selectedToken.symbol}</div>
                                <div className="text-xs opacity-60">
                                  {addressShortener(selectedToken.address)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            "Select Token"
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="popover-content-width-same-as-its-trigger p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." />
                          <CommandEmpty>No token found.</CommandEmpty>
                          <CommandGroup>
                            {tokens.map((token) => (
                              <CommandItem
                                key={token.id}
                                value={token.id}
                                className="w-full border rounded-lg my-2 flex items-center gap-1"
                                onSelect={(currentValue) => {
                                  onChange(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <div className="flex gap-2 items-center flex-1">
                                  <img
                                    src={token.imageUrl}
                                    alt="log"
                                    className="w-9 h-9 rounded-full"
                                  />
                                  <div>
                                    <div>{token.symbol}</div>
                                    <div className="text-xs opacity-60">
                                      {addressShortener(token.address)}
                                    </div>
                                  </div>
                                </div>
                                <Check
                                  className={cn(
                                    "mr-2 h-7 w-7 p-1",
                                    value === token.id
                                      ? "opacity-100 bg-secondary rounded-full"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteWidget({ id: widget.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default WidgetForm;
