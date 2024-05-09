import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { campaignRouter } from "./campaign";
import { whitelistRouter } from "./whitelist";

export const appRouter = router({
  computers: computersRouter,
  campaign: campaignRouter,
  whitelist: whitelistRouter,
});

export type AppRouter = typeof appRouter;
