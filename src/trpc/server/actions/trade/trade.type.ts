import { z } from "zod";

export const tradeSchema = z.object({
  quotedURL: z.string().url(),
  widgetId: z.string().min(5, "Invalid widgetId"),
  sendTokenId: z.string().min(5, "Invalid"),
  receiveTokenId: z.string().min(5, "Invalid"),
});

export const sendTokenSchema = z.object({
  sendAddress: z.string().min(31, "Invalid Wallet Address"),
  tokenAddress: z.string().min(31, "Invalid Wallet Address"),
  sendAmount: z.string().min(1, "Enter Amount"),
});

export type FullSendTokenSchemaType = z.infer<typeof sendTokenSchema>;

export type SendTokenSchemaType = Omit<FullSendTokenSchemaType, "tokenAddress">;
