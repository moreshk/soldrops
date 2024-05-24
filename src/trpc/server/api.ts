import "server-only";

import { env } from "@/lib/env.mjs";

import {
  createTRPCProxyClient,
  loggerLink,
  TRPCClientError,
} from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { type TRPCErrorResponse } from "@trpc/server/rpc";
import { observable } from "@trpc/server/observable";
import { cache } from "react";
import SuperJSON from "superjson";
import { appRouter } from "./routers";
import { createTRPCContext } from "./index";
import { headers } from "next/headers";

const cachedCreateContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({ headers: heads });
});

export const server = createTRPCProxyClient<typeof appRouter>({
  transformer: SuperJSON,
  links: [
    loggerLink({
      enabled: (op) =>
        env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    () =>
      ({ op }) =>
        observable((observer) => {
          cachedCreateContext()
            .then((ctx) => {
              return callProcedure({
                procedures: appRouter._def.procedures,
                path: op.path,
                rawInput: op.input,
                ctx,
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});
