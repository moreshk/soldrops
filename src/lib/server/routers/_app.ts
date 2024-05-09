import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { campaignRouter } from "./campaign";
import { whitelistRouter } from "./whitelist";
import { tokensRouter } from "./tokens";

export const appRouter = router({
  computers: computersRouter,
  campaign: campaignRouter,
  whitelist: whitelistRouter,
  tokens: tokensRouter,
});

export type AppRouter = typeof appRouter;
