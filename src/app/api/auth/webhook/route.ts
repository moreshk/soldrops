import { clerkClient } from "@clerk/nextjs/server";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { Keypair } from "@solana/web3.js";
import CryptoJS from "crypto-js";
import { env } from "@/lib/env.mjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/user";

const webhookSecret = process.env.WEBHOOK_SECRET || "";

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = evt.type;

  if (eventType === "user.created") {
    const { id } = evt.data;
    const newWallet = new Keypair();
    const walletAddress = newWallet.publicKey.toString();
    var privateKey = CryptoJS.AES.encrypt(
      newWallet.secretKey.toString(),
      env.DECODE_ENCODE_KEY
    ).toString();
    const user = await clerkClient.users.getUser(id as string);
    if (user.privateMetadata.privateKey) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    await clerkClient.users.updateUserMetadata(id as string, {
      privateMetadata: {
        privateKey,
        walletAddress,
      },
      publicMetadata: {
        walletAddress,
      },
    });
    const emailDetails = evt.data.email_addresses as unknown as {
      email_address: string;
    }[];
    const email = emailDetails[0].email_address as string;
    await db.insert(users).values({
      email: email,
      id: id as string,
      walletAddress: walletAddress,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

type EventType = "user.created" | "user.updated" | "email.created" | "*";

type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
