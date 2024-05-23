import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { whitelist } from "@/lib/db/schema/whitelist";

const baseSchema = createSelectSchema(whitelist).omit(timestamps);

export const insertWhitelistSchema =
  createInsertSchema(whitelist).omit(timestamps);
export const insertWhitelistParams = baseSchema
  .extend({
    followTwitter: z.coerce.boolean().optional(),
    retweetAnnouncement: z.coerce.boolean().optional(),
    whitelisted: z.coerce.boolean().optional(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateWhitelistSchema = baseSchema;
export const updateWhitelistParams = baseSchema
  .extend({
    followTwitter: z.coerce.boolean().optional(),
    retweetAnnouncement: z.coerce.boolean().optional(),
    whitelisted: z.coerce.boolean().optional(),
  })
  .omit({
    userId: true,
    campaignId: true,
  });
export const whitelistIdSchema = baseSchema.pick({ id: true });

// Types for whitelist - used to type API request params and within Components
export type Whitelist = typeof whitelist.$inferSelect;
export type NewWhitelist = z.infer<typeof insertWhitelistSchema>;
export type NewWhitelistParams = z.infer<typeof insertWhitelistParams>;
export type UpdateWhitelistParams = z.infer<typeof updateWhitelistParams>;
export type WhitelistId = z.infer<typeof whitelistIdSchema>["id"];
