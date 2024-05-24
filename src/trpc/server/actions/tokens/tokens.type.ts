import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";
import { tokens } from "@/lib/db/schema/tokens";
import { getAllTokens } from "./tokens.queries";

const baseSchema = createSelectSchema(tokens).omit(timestamps);

export const insertTokenSchema = createInsertSchema(tokens).omit(timestamps);
export const insertTokenParams = baseSchema
  .extend({
    decimal: z.coerce.number(),
    listing: z.coerce.boolean(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateTokenSchema = baseSchema;
export const updateTokenParams = baseSchema
  .extend({
    decimal: z.coerce.number(),
    listing: z.coerce.boolean(),
  })
  .omit({
    userId: true,
  });
export const tokenIdSchema = baseSchema.pick({ id: true });

export type Token = typeof tokens.$inferSelect;
export type NewToken = z.infer<typeof insertTokenSchema>;
export type NewTokenParams = z.infer<typeof insertTokenParams>;
export type UpdateTokenParams = z.infer<typeof updateTokenParams>;
export type TokenId = z.infer<typeof tokenIdSchema>["id"];

export type CompleteToken = Awaited<
  ReturnType<typeof getAllTokens>
>["tokens"][number];

export const tokenData = z.object({
  tokenAddress: z.string(),
});
