import { widgets } from "@/lib/db/schema/widgets";
import { timestamps } from "@/lib/utils";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { getWidgets } from "./widgets.queries";

const baseSchema = createSelectSchema(widgets).omit(timestamps);

export const insertWidgetSchema = createInsertSchema(widgets).omit(timestamps);
export const insertWidgetParams = baseSchema
  .extend({
    feeWalletAddress: z.string().min(12, "Please Add Fee wallet"),
    tokenId: z.string().min(12, "Please select token"),
    website: z.string().url("Invalid url").optional(),
  })
  .omit({
    id: true,
    userId: true,
    feePercentage: true,
  });

export const updateWidgetSchema = baseSchema.omit({
  userId: true,
  feePercentage: true,
});
export const updateWidgetParams = baseSchema
  .extend({
    feeWalletAddress: z.string().min(12, "Please Add Fee wallet"),
    tokenId: z.string().min(12, "Please select token"),
    website: z.string().url().optional(),
  })
  .omit({
    userId: true,
    feePercentage: true,
  });
export const widgetIdSchema = baseSchema.pick({ id: true });

// Types for widgets - used to type API request params and within Components
export type Widget = typeof widgets.$inferSelect;
export type NewWidget = z.infer<typeof insertWidgetSchema>;
export type NewWidgetParams = z.infer<typeof insertWidgetParams>;
export type UpdateWidgetParams = z.infer<typeof updateWidgetParams>;
export type WidgetId = z.infer<typeof widgetIdSchema>["id"];

// this type infers the return from getWidgets() - meaning it will include any joins
export type CompleteWidget = Awaited<
  ReturnType<typeof getWidgets>
>["widgets"][number];
