import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { widgets } from "@/lib/db/schema/widgets";
import {
  NewWidgetParams,
  UpdateWidgetParams,
  WidgetId,
  insertWidgetSchema,
  updateWidgetSchema,
  widgetIdSchema,
} from "./widgets.type";
import { auth } from "@clerk/nextjs/server";

export const createWidget = async (widget: NewWidgetParams) => {
  const { userId, sessionClaims } = auth().protect();
  const isAdmin = sessionClaims.userType === "admin";

  if (!isAdmin) throw { message: "Not admin user" };
  const newWidget = insertWidgetSchema.parse({
    ...widget,
    userId: userId!,
  });
  try {
    const [w] = await db.insert(widgets).values(newWidget).returning();
    return { widget: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const updateWidget = async (
  id: WidgetId,
  widget: UpdateWidgetParams
) => {
  const { userId, sessionClaims } = auth().protect();
  const isAdmin = sessionClaims.userType === "admin";

  if (!isAdmin) throw { message: "Not admin user" };
  const { id: widgetId } = widgetIdSchema.parse({ id });
  const newWidget = updateWidgetSchema.parse({
    ...widget,
    userId: userId!,
  });
  try {
    const [w] = await db
      .update(widgets)
      .set({ ...newWidget, feePercentage: undefined, updatedAt: new Date() })
      .where(and(eq(widgets.id, widgetId!), eq(widgets.userId, userId!)))
      .returning();
    return { widget: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const deleteWidget = async (id: WidgetId) => {
  const { userId, sessionClaims } = auth().protect();
  const isAdmin = sessionClaims.userType === "admin";

  if (!isAdmin) throw { message: "Not admin user" };
  const { id: widgetId } = widgetIdSchema.parse({ id });
  try {
    const [w] = await db
      .delete(widgets)
      .where(and(eq(widgets.id, widgetId!), eq(widgets.userId, userId!)))
      .returning();
    return { widget: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};
