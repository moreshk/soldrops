"use server";

import { revalidatePath } from "next/cache";
import {
  createWidget,
  deleteWidget,
  updateWidget,
} from "@/lib/api/widgets/mutations";
import {
  WidgetId,
  NewWidgetParams,
  UpdateWidgetParams,
  widgetIdSchema,
  insertWidgetParams,
  updateWidgetParams,
} from "@/lib/db/schema/widgets";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateWidgets = () => revalidatePath("/widgets");

export const createWidgetAction = async (input: NewWidgetParams) => {
  try {
    const payload = insertWidgetParams.parse(input);
    await createWidget(payload);
    revalidateWidgets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateWidgetAction = async (input: UpdateWidgetParams) => {
  try {
    const payload = updateWidgetParams.parse(input);
    await updateWidget(payload.id, payload);
    revalidateWidgets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteWidgetAction = async (input: WidgetId) => {
  try {
    const payload = widgetIdSchema.parse({ id: input });
    await deleteWidget(payload.id);
    revalidateWidgets();
  } catch (e) {
    return handleErrors(e);
  }
};