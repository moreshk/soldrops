import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/trpc/server/routers";

export const trpc = createTRPCReact<AppRouter>({});
