import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  WidgetId,
  NewWidgetParams,
  UpdateWidgetParams,
  updateWidgetSchema,
  insertWidgetSchema,
  widgets,
  widgetIdSchema,
} from "@/lib/db/schema/widgets";
import { getUserAuth } from "@/lib/auth/utils";

export const createWidget = async (widget: NewWidgetParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.isAdmin) throw { message: "Not admin user" };
  const newWidget = insertWidgetSchema.parse({
    ...widget,
    userId: session?.user.id!,
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
  const { session } = await getUserAuth();
  if (!session?.user.isAdmin) throw { message: "Not admin user" };
  const { id: widgetId } = widgetIdSchema.parse({ id });
  const newWidget = updateWidgetSchema.parse({
    ...widget,
    userId: session?.user.id!,
  });
  try {
    const [w] = await db
      .update(widgets)
      .set({ ...newWidget, feePercentage: undefined, updatedAt: new Date() })
      .where(
        and(eq(widgets.id, widgetId!), eq(widgets.userId, session?.user.id!))
      )
      .returning();
    return { widget: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};

export const deleteWidget = async (id: WidgetId) => {
  const { session } = await getUserAuth();
  if (!session?.user.isAdmin) throw { message: "Not admin user" };
  const { id: widgetId } = widgetIdSchema.parse({ id });
  try {
    const [w] = await db
      .delete(widgets)
      .where(
        and(eq(widgets.id, widgetId!), eq(widgets.userId, session?.user.id!))
      )
      .returning();
    return { widget: w };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { message };
  }
};
