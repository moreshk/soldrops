import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DrawerFooter } from "../ui/drawer";
import { SendTokenSchemaType } from "@/trpc/server/actions/trade/trade.type";

export const SendTokenInputForm = ({
  onClose,
  maxAmount,
  symbol,
  setSendDetails,
  sendDetails,
  usdTokenValue,
}: {
  onClose: () => void;
  maxAmount: string;
  symbol: string;
  sendDetails?: SendTokenSchemaType;
  setSendDetails: (value: SendTokenSchemaType) => void;
  usdTokenValue: number;
}) => {
  const form = useForm<SendTokenSchemaType>({
    defaultValues: {
      sendAddress: sendDetails?.sendAddress ?? "",
      sendAmount: sendDetails?.sendAmount ?? "",
    },
    mode: "onChange",
  });
  const useMaxAmount = +maxAmount;

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
          render={({ field: { onChange, value, ...props } }) => (
            <FormItem className="m-4">
              <FormLabel>Amount</FormLabel>
              <FormControl className="w-full">
                <div className="relative w-full">
                  <Input
                    value={value}
                    {...props}
                    onChange={(e) => {
                      const input = e.target.value.replace(/[^\d.]+/g, "");
                      onChange(input);
                    }}
                    disabled={props.disabled}
                    placeholder="Amount"
                  />

                  <Button
                    onClick={() => onChange(`${maxAmount}`)}
                    type="button"
                    size="sm"
                    className="rounded-full text-xs h-7 absolute right-2 top-1.5"
                    variant="secondary"
                  >
                    Max
                  </Button>
                </div>
              </FormControl>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {value && +value <= +maxAmount && (
                    <p className="text-sm text-muted-foreground">
                      ${(+value * usdTokenValue).toFixed(2)}
                    </p>
                  )}
                  <FormMessage />
                </div>
                <div className="flex justify-end text-end text-muted-foreground text-sm">
                  Available {useMaxAmount} {symbol}
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
                +value <= +maxAmount ||
                `Amount should not exceed ${useMaxAmount} ${symbol}`
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
