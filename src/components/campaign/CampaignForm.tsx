"use client";

import {
  Campaign,
  NewCampaignParams,
  insertCampaignParams,
} from "@/lib/db/schema/campaign";
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
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CampaignForm = ({
  campaign,
  closeModal,
}: {
  campaign?: Campaign;
  closeModal?: () => void;
}) => {
  const editing = !!campaign?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertCampaignParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertCampaignParams),
    defaultValues: campaign
      ? {
          tokenContractAddress: campaign.tokenContractAddress,
          tokenDecimal: campaign.tokenDecimal,
          tokenSymbol: campaign.tokenSymbol,
          tokenImage: campaign.tokenImage,
          totalTokenDrop: campaign.totalTokenDrop,
          totalWalletNumber: campaign.totalWalletNumber,
          twitterHandel: campaign.twitterHandel || "",
          announcementTweet: campaign.announcementTweet || "",
          goLiveData: campaign.goLiveData.toString(),
        }
      : {
          tokenContractAddress: "",
          tokenSymbol: "",
          tokenImage: "",
          totalTokenDrop: 0,
          tokenDecimal: 0,
          totalWalletNumber: 0,
          twitterHandel: "",
          announcementTweet: "",
          goLiveData: "",
        },
  });

  const onComplete = async (
    action: "create" | "update" | "delete",
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    await utils.campaign.getCampaigns.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Campaign ${action}d!`);
  };

  const { mutate: createCampaign, isLoading: isCreating } =
    trpc.campaign.createCampaign.useMutation({
      onSuccess: (res) => onComplete("create"),
      onError: (err) => onComplete("create", { error: err.message }),
    });

  const { mutate: updateCampaign, isLoading: isUpdating } =
    trpc.campaign.updateCampaign.useMutation({
      onSuccess: (res) => onComplete("update"),
      onError: (err) => onComplete("update", { error: err.message }),
    });

  const { mutate: deleteCampaign, isLoading: isDeleting } =
    trpc.campaign.deleteCampaign.useMutation({
      onSuccess: (res) => onComplete("delete"),
      onError: (err) => onComplete("delete", { error: err.message }),
    });

  const handleSubmit = (values: NewCampaignParams) => {
    if (editing) {
      updateCampaign({ ...values, id: campaign.id });
    } else {
      createCampaign({
        ...values,
        goLiveData: new Date(values.goLiveData).toISOString(),
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="tokenContractAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Contract Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenSymbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Symbol</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Image</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenDecimal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Decimal</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalTokenDrop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Token Drop</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalWalletNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Wallet Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterHandel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Handel</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="announcementTweet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Announcement Tweet</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goLiveData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Go Live Data</FormLabel>
              <br />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
            onClick={() => deleteCampaign({ id: campaign.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default CampaignForm;
