/* eslint-disable @next/next/no-img-element */
"use client";

import {
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TokenContractAddress } from "./TokenContractAddress";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const CampaignForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [isSendingFee, setIsSendingFee] = useState(false);
  const router = useRouter();
  const utils = trpc.useContext();
  // @ts-ignore
  const form = useForm<NewCampaignParams>({
    resolver: zodResolver(insertCampaignParams),
    defaultValues: {
      tokenContractAddress: "",
      tokenSymbol: "",
      tokenImage: "",
      totalTokenDrop: 0,
      tokenDecimal: 0,
      totalWalletNumber: 0,
      twitterHandel: "",
      announcementTweet: "",
      goLiveData: "",
      transactionHash: "",
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
    toast.success(`Campaign ${action}d!`);
    await utils.campaign.getCampaigns.invalidate();
  };

  const { mutate: createCampaign, isLoading: isCreating } =
    trpc.campaign.createCampaign.useMutation({
      onSuccess: (res) => onComplete("create"),
      onError: (err) => onComplete("create", { error: err.message }),
    });

  const handleSubmit = async (values: NewCampaignParams) => {
    if (!publicKey || !signTransaction) return;
    try {
      setIsSendingFee(true);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(
            "9BAa8bSQrUAT3nipra5bt3DJbW2Wyqfc2SXw3vGcjpbj"
          ),
          lamports: LAMPORTS_PER_SOL * 0.1,
        })
      );
      transaction.feePayer = publicKey;
      const blockHash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockHash.blockhash;
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature, "processed");
      setIsSendingFee(false);
      createCampaign({
        ...values,
        goLiveData: new Date(values.goLiveData).toISOString(),
        transactionHash: signature.toString(),
      });
    } catch (e) {
      setIsSendingFee(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto pb-40">
      <div className="text-lg font-semibold">
        Create Campaign <Badge>We charge 0.1 SOL to create campaign</Badge>
      </div>
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
              <TokenContractAddress
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                disable={isSendingFee}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="tokenSymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Symbol</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading || field.disabled || isSendingFee}
                        />
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
                        <Input
                          {...field}
                          disabled={isLoading || field.disabled || isSendingFee}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tokenImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Image</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {field.value ? (
                          <img
                            src={field.value}
                            alt="logo of token"
                            height={40}
                            className="rounded-full flex-shrink-0"
                            width={40}
                          />
                        ) : (
                          <div className="bg-secondary w-10 h-10 rounded-full flex-shrink-0" />
                        )}
                        <Input
                          {...field}
                          disabled={isLoading || field.disabled || isSendingFee}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
          <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
            <legend className="text-lg font-medium group-hover:text-blue-300">
              Drop Details
            </legend>
            <FormField
              control={form.control}
              name="totalTokenDrop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Token Drop</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading || field.disabled || isSendingFee}
                    />
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
                    <Input {...field} disabled={isLoading || field.disabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <Input
                        {...field}
                        disabled={isLoading || field.disabled || isSendingFee}
                      />
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
                    <Input
                      {...field}
                      disabled={isLoading || field.disabled || isSendingFee}
                    />
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
                          disabled={isLoading || field.disabled}
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
          <Button
            type="submit"
            className="w-full"
            disabled={isCreating || isLoading || isSendingFee}
          >
            {(isCreating || isSendingFee) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <>
              {isCreating || isSendingFee
                ? "Creating Campaign..."
                : "Create Campaign"}
            </>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CampaignForm;
