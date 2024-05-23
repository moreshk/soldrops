import { campaignRouter } from "./campaign";
import { whitelistRouter } from "./whitelist";
import { tokensRouter } from "./tokens";
import { widgetsRouter } from "./widgets";
import { trade } from "./trade";
import { router } from "@/lib/trpc-server/trpc";
import { swapRouter } from "./swap";
import { tokenBalanceRouter } from "./token-balance";

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
