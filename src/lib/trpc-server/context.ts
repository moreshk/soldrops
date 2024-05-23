import { db } from "@/lib/db/index";

import * as trpc from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";

export const createContext = async (opts: CreateNextContextOptions) => {
  return { db, auth: getAuth(opts.req), ...opts };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
