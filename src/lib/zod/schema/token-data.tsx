import { z } from "zod";

export const tokenData = z.object({
  tokenAddress: z.string(),
});

export type TokenDataSchema = z.infer<typeof tokenData>;
