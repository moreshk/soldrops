import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { campaignRouter } from "./campaign";
import { whitelistRouter } from "./whitelist";
import { authRouter } from "./auth";

export const appRouter = router({
  computers: computersRouter,
  campaign: campaignRouter,
  whitelist: whitelistRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
