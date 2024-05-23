import { z } from "zod";

export const swapSchema = z.object({
  quotedURL: z.string(),
});
