import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const TokenContractAddress = ({
  setIsLoading,
  isLoading,
  disable,
}: {
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  disable: boolean;
}) => {
  const { control, watch, setValue } = useFormContext();
  const tokenContractAddress = watch("tokenContractAddress") as string;

  const fetchTokenMetadata = async () => {
    if (tokenContractAddress.length >= 40) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/token-metadata`, {
          method: "POST",
          body: JSON.stringify({
            tokenAddress: tokenContractAddress,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch token metadata");
        }
        const metadata = await response.json();
        setValue("tokenSymbol", metadata.symbol);
        setValue("tokenImage", metadata.image);
        setValue("tokenDecimal", metadata.decimals);
        setIsLoading(false);
      } catch (error) {
        setValue("tokenSymbol", "");
        setValue("tokenImage", "");
        setValue("tokenDecimal", 1);
        setIsLoading(false);
        console.error("Error fetching token metadata:", error);
        // Handle error state here, e.g., show an error message
      }
    }
  };

  useEffect(() => {
    fetchTokenMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenContractAddress]);

  return (
    <FormField
      control={control}
      name="tokenContractAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Token Contract Address</FormLabel>
          <FormControl>
            <div className="flex items-center relative">
              <Input
                {...field}
                disabled={disable || field.disabled || isLoading}
              />
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin absolute right-0" />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
