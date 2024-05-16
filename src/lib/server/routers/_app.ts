import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { campaignRouter } from "./campaign";
import { whitelistRouter } from "./whitelist";
import { tokensRouter } from "./tokens";
import { widgetsRouter } from "./widgets";

export const appRouter = router({
  computers: computersRouter,
  campaign: campaignRouter,
  whitelist: whitelistRouter,
  tokens: tokensRouter,
  widgets: widgetsRouter,
});

export type AppRouter = typeof appRouter;
