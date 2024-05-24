import { env } from "@/lib/env.mjs";
import { Connection } from "@solana/web3.js";

export const connection = new Connection(env.HELIUS_RPC_URL);
