import CryptoJS from "crypto-js";
import { db } from "@/lib/db";
import { registerSchema, users } from "@/lib/db/schema/auth";
import { env } from "@/lib/env.mjs";
import { Keypair } from "@solana/web3.js";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body: unknown = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      let zodErrors = {};
      result.error.issues.forEach((issue) => {
        zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
      });
      return new NextResponse(JSON.stringify({ error: zodErrors }), {
        status: 400,
      });
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, result.data.email));
    if (user) {
      return new NextResponse(JSON.stringify({ error: "User already exist" }), {
        status: 400,
      });
    }
    const hashedPassword = await hash(result.data.password, 10);
    const newWallet = new Keypair();
    const walletAddress = newWallet.publicKey.toString();
    var privateKey = CryptoJS.AES.encrypt(
      newWallet.secretKey.toString(),
      env.DECODE_ENCODE_KEY
    ).toString();

    const [newUser] = await db
      .insert(users)
      .values({
        password: hashedPassword,
        email: result.data.email,
        name: result.data.name,
        walletAddress,
        privateKey,
      })
      .returning();
    const userDetails: User = {
      id: newUser.id,
      isAdmin: newUser.isAdmin || false,
      userType: newUser.userType || "user",
      email: newUser.email || undefined,
      image: newUser.image || undefined,
      name: newUser.name || undefined,
      username: newUser.name || undefined,
      walletAddress: newUser.walletAddress,
      defaultURL: newUser.defaultURL || "/",
    };

    return new NextResponse(JSON.stringify(userDetails), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
};
