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
import { trpc } from "@/trpc/client/api";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TokenContractAddress } from "./TokenContractAddress";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import {
  NewTokenParams,
  Token,
  insertTokenParams,
} from "@/trpc/server/actions/tokens/tokens.type";

const TokenForm = ({
  token,
  closeModal,
}: {
  token?: Token;
  closeModal?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const editing = !!token?.id;
  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertTokenParams>>({
    resolver: zodResolver(insertTokenParams),
    defaultValues: token ?? {
      name: "",
      symbol: "",
      imageUrl: "",
      description: "",
      decimal: 0,
      listing: false,
      address: "",
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

    await utils.tokens.getUsersTokens.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Token ${action}d!`);
  };

  const { mutate: createToken, isLoading: isCreating } =
    trpc.tokens.createToken.useMutation({
      onSuccess: (res) => onSuccess("create"),
      onError: (err) => onSuccess("create", { error: err.message }),
    });

  const { mutate: updateToken, isLoading: isUpdating } =
    trpc.tokens.updateToken.useMutation({
      onSuccess: (res) => onSuccess("update"),
      onError: (err) => onSuccess("update", { error: err.message }),
    });

  const { mutate: deleteToken, isLoading: isDeleting } =
    trpc.tokens.deleteToken.useMutation({
      onSuccess: (res) => onSuccess("delete"),
      onError: (err) => onSuccess("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewTokenParams) => {
    if (editing) {
      updateToken({ ...values, id: token.id });
    } else {
      createToken(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-4"}>
        <TokenContractAddress
          disable={isLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading || field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading || field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Url</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading || field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isLoading || field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="decimal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Decimal</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading || field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="listing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing</FormLabel>
              <br />
              <FormControl>
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  value={""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
            onClick={() => deleteToken({ id: token.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default TokenForm;
