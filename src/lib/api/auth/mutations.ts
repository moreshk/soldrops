"use server";
import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { user } from "@/lib/db/migrations/schema";

export const updateUserWallet = async (walletAddress: string | null) => {
  const { session } = await getUserAuth();
  if (session?.user.walletAddress) {
    throw { error: "wallet address already exist" };
  }
  try {
    const [c] = await db
      .update(user)
      .set({ walletAddress })
      .where(eq(user.id, session?.user.id!))
      .returning();
    return { campaign: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
