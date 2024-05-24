import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
import { env } from "@/lib/env.mjs";
import { createTRPCContext } from "@/trpc/server";
import { appRouter } from "@/trpc/server/routers";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
    responseMeta() {
      return {
        headers: {
          "cache-control": "no-cache",
        },
      };
    },
  });

export { handler as GET, handler as POST };
