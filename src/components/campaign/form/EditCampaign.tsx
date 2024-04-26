/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Campaign,
  UpdateCampaignParams,
  updateCampaignParams,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EditCampaign = ({ campaign }: { campaign: Campaign }) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<UpdateCampaignParams>({
    resolver: zodResolver(updateCampaignParams),
    defaultValues: {
      ...campaign,
      id: campaign.id,
      twitterHandel: campaign.twitterHandel || "",
      announcementTweet: campaign.announcementTweet || "",
      goLiveData: campaign.goLiveData.toString(),
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
    router.push("/campaign");
    await utils.campaign.getCampaigns.invalidate();
    router.refresh();
    toast.success(`Campaign details updated`);
  };
  const { mutate: updateCampaign, isLoading: isUpdating } =
    trpc.campaign.updateCampaign.useMutation({
      onSuccess: (res) => onComplete("update"),
      onError: (err) => onComplete("update", { error: err.message }),
    });

  const handleSubmit = async (values: UpdateCampaignParams) => {
    updateCampaign({
      ...values,
      goLiveData: new Date(values.goLiveData).toISOString(),
      id: campaign.id,
    });
  };
  return (
    <div className="max-w-xl mx-auto pb-40">
      <div className="text-lg font-semibold">Update Campaign</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={"space-y-4 pt-6"}
        >
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 focus-within:border-blue-300 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Token details
            </legend>
            <div className="space-y-5">
              <div className="w-full gap-3">
                <div>Token Address - {campaign.tokenContractAddress}</div>
                <div>Token Decimal - {campaign.tokenDecimal}</div>
                <div>Token Symbol - {campaign.tokenSymbol}</div>
                <img
                  src={campaign.tokenImage}
                  alt="token symbol"
                  width={60}
                  height={60}
                  className="rounded-full flex-shrink-0"
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Drop Details
            </legend>
            <p>Total Tokens drop {campaign.totalTokenDrop}</p>
            <p>Total Wallets can join campaign {campaign.totalWalletNumber}</p>
          </fieldset>
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Twitter details
            </legend>
            <FormField
              control={form.control}
              name="twitterHandel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Handel Handel</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded-md pl-3">
                      <p className="pr-2">https://twitter.com/</p>
                      <Input {...field} />
                    </div>
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
                  <FormLabel>Announcement Tweet URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Launch details
            </legend>
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
                          disabled={field.disabled}
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
          </fieldset>
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <>{isUpdating ? "Updating Campaign..." : "Update Campaign"}</>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditCampaign;
