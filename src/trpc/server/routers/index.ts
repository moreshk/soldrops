import { campaignRouter } from "@/trpc/server/routers/campaign";
import { swapRouter } from "@/trpc/server/routers/swap";
import { tokenBalanceRouter } from "@/trpc/server/routers/token-balance";
import { tokensRouter } from "@/trpc/server/routers/tokens";
import { trade } from "@/trpc/server/routers/trade";
import { whitelistRouter } from "@/trpc/server/routers/whitelist";
import { widgetsRouter } from "@/trpc/server/routers/widgets";
import { router } from "@/trpc/server/index";

export const appRouter = router({
  campaign: campaignRouter,
  whitelist: whitelistRouter,
  tokens: tokensRouter,
  widgets: widgetsRouter,
  trade: trade,
  swap: swapRouter,
  tokenBalance: tokenBalanceRouter,
});

export type AppRouter = typeof appRouter;
