import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { campaignRouter } from "./campaign";

export const appRouter = router({
  computers: computersRouter,
  campaign: campaignRouter,
});

export type AppRouter = typeof appRouter;
