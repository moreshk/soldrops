import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { WidgetId, widgetIdSchema } from "./widgets.type";
import { widgets } from "@/lib/db/schema/widgets";
import { auth } from "@clerk/nextjs/server";

export const getWidgets = async () => {
  const { userId } = auth();
  const rows = await db.query.widgets.findMany({
    where: eq(widgets.userId, userId!),
    with: {
      token: true,
    },
  });
  const w = rows;
  return { widgets: w };
};

export const getWidgetById = async (id: WidgetId) => {
  try {
    const { id: widgetId } = widgetIdSchema.parse({ id });
    const row = await db.query.widgets.findFirst({
      where: eq(widgets.id, widgetId),
      with: {
        token: true,
      },
    });

    if (row === undefined) return {};
    const w = row;
    return { widget: w };
  } catch (e) {
    return {};
  }
};
