import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { campaignRouter } from "./campaign";
import { whitelistRouter } from "./whitelist";
import { tokensRouter } from "./tokens";
import { widgetsRouter } from "./widgets";
import { tradeRouter } from "./trade";

export const appRouter = router({
  computers: computersRouter,
  campaign: campaignRouter,
  whitelist: whitelistRouter,
  tokens: tokensRouter,
  widgets: widgetsRouter,
  tradeRouter: tradeRouter,
});

export type AppRouter = typeof appRouter;
