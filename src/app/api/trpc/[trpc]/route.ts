import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env.mjs";
import { appRouter } from "@/lib/trpc-server/routers/_app";
import { createContext as createTRPCContext } from "@/lib/trpc-server/context";

const createContext = async (req: NextRequest, res: NextResponse) => {
  return createTRPCContext({
    // @ts-ignore
    res,
    // @ts-ignore
    req,
  });
};

const handler = (req: NextRequest, res: NextResponse) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req, res),
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
