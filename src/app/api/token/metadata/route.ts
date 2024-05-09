import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserAuth } from "@/lib/auth/utils";
import { env } from "@/lib/env.mjs";

export const tokenData = z.object({
  tokenAddress: z.string(),
});

export type TokenDataSchema = z.infer<typeof tokenData>;

export async function POST(req: Request) {
  try {
    const { session } = await getUserAuth();
    if (!session) return new Response("Error", { status: 400 });
    const result = tokenData.safeParse(await req.json());
    if (!result.success) {
      let zodErrors = {};
      result.error.issues.forEach((issue) => {
        zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
      });
      return NextResponse.json({ error: zodErrors }, { status: 400 });
    }
    const response = await fetch(env.HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAsset",
        params: {
          id: result.data?.tokenAddress,
          displayOptions: {
            showFungible: true,
          },
        },
      }),
    });
    const responseData = await response.json();
    const data = {
      name: responseData.result.content.metadata.name,
      description: responseData.result.content.metadata.description,
      symbol: responseData.result.content.metadata.symbol,
      decimals: responseData.result.token_info.decimals,
      image: responseData.result.content?.links?.image,
    };

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}
