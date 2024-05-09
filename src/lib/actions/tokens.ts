"use server";

import { revalidatePath } from "next/cache";
import {
  createToken,
  deleteToken,
  updateToken,
} from "@/lib/api/tokens/mutations";
import {
  TokenId,
  NewTokenParams,
  UpdateTokenParams,
  tokenIdSchema,
  insertTokenParams,
  updateTokenParams,
} from "@/lib/db/schema/tokens";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateTokens = () => revalidatePath("/tokens");

export const createTokenAction = async (input: NewTokenParams) => {
  try {
    const payload = insertTokenParams.parse(input);
    await createToken(payload);
    revalidateTokens();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTokenAction = async (input: UpdateTokenParams) => {
  try {
    const payload = updateTokenParams.parse(input);
    await updateToken(payload.id, payload);
    revalidateTokens();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTokenAction = async (input: TokenId) => {
  try {
    const payload = tokenIdSchema.parse({ id: input });
    await deleteToken(payload.id);
    revalidateTokens();
  } catch (e) {
    return handleErrors(e);
  }
};