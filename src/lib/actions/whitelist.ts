"use server";

import { revalidatePath } from "next/cache";
import {
  createWhitelist,
  deleteWhitelist,
  updateWhitelist,
} from "@/lib/api/whitelist/mutations";
import {
  WhitelistId,
  NewWhitelistParams,
  UpdateWhitelistParams,
  whitelistIdSchema,
  insertWhitelistParams,
  updateWhitelistParams,
} from "@/lib/db/schema/whitelist";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateWhitelists = () => revalidatePath("/whitelist");

export const createWhitelistAction = async (input: NewWhitelistParams) => {
  try {
    const payload = insertWhitelistParams.parse(input);
    await createWhitelist(payload);
    revalidateWhitelists();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateWhitelistAction = async (input: UpdateWhitelistParams) => {
  try {
    const payload = updateWhitelistParams.parse(input);
    await updateWhitelist(payload.id, payload);
    revalidateWhitelists();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteWhitelistAction = async (input: WhitelistId) => {
  try {
    const payload = whitelistIdSchema.parse({ id: input });
    await deleteWhitelist(payload.id);
    revalidateWhitelists();
  } catch (e) {
    return handleErrors(e);
  }
};