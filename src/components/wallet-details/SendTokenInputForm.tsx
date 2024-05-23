import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DrawerFooter } from "../ui/drawer";
import { SendTokenSchemaType } from "@/lib/db/schema/tokens";

export const SendTokenInputForm = ({
  onClose,
  maxAmount,
  symbol,
  setSendDetails,
  sendDetails,
}: {
  onClose: () => void;
  maxAmount: string;
  symbol: string;
  sendDetails?: SendTokenSchemaType;
  setSendDetails: (value: SendTokenSchemaType) => void;
}) => {
  const form = useForm<SendTokenSchemaType>({
    defaultValues: {
      sendAddress: sendDetails?.sendAddress ?? "",
      sendAmount: sendDetails?.sendAmount ?? "",
    },
    mode: "onChange",
  });

  const handleSubmit = (values: SendTokenSchemaType) => {
    setSendDetails(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-4"}>
        <FormField
          control={form.control}
          name="sendAddress"
          render={({ field }) => (
            <FormItem className="m-4">
              <FormLabel>Recipient&apos;s Solana address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={field.disabled}
                  placeholder="Recipient's Solana address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          rules={{
            required: {
              message: "Please Wallet address",
              value: true,
            },
            minLength: {
              value: 31,
              message: "Invalid Wallet Address",
            },
          }}
        />
        <FormField
          control={form.control}
          name="sendAmount"
          render={({ field: { onChange, ...props } }) => (
            <FormItem className="m-4">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  {...props}
                  onChange={(e) => {
                    const input = e.target.value.replace(/[^\d.]+/g, "");
                    onChange(input);
                  }}
                  disabled={props.disabled}
                  placeholder="Amount"
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <div>
                  <FormMessage />
                </div>
                <div className="flex justify-end text-end text-muted-foreground text-sm">
                  Available {maxAmount} {symbol}
                </div>
              </div>
            </FormItem>
          )}
          rules={{
            required: {
              message: "Please Enter amount",
              value: true,
            },
            validate: (value) => {
              return (
                +value < +maxAmount ||
                `Amount should not exceed ${maxAmount} ${symbol}`
              );
            },
          }}
        />
        <DrawerFooter>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Next
            </Button>
          </div>
        </DrawerFooter>
      </form>
    </Form>
  );
};
