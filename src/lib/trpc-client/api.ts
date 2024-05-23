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
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { cache } from "react";

import SuperJSON from "superjson";
import { NextApiRequest, NextApiResponse } from "next";
import { createContext } from "@/lib/trpc-server/context";
import { appRouter } from "@/lib/trpc-server/routers/_app";

const cachedCreateContext = cache(async (opts: CreateNextContextOptions) => {
  return createContext(opts);
});

export const api = createTRPCProxyClient<typeof appRouter>({
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
          cachedCreateContext({
            req: op.context.req as NextApiRequest,
            res: op.context.res as NextApiResponse,
          })
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
