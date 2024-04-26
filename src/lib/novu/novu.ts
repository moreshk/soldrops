import { Novu } from "@novu/node";
import { env } from "../env.mjs";

export const novu = new Novu(env.NOVU_API_KEY, {
    backendUrl: 'https://novu.soldrops.xyz/api'
});
