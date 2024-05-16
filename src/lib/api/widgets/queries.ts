import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type WidgetId,
  widgetIdSchema,
  widgets,
} from "@/lib/db/schema/widgets";

export const getWidgets = async () => {
  const { session } = await getUserAuth();
  const rows = await db.query.widgets.findMany({
    where: eq(widgets.userId, session?.user.id!),
    with: {
      token: true,
    },
  });
  const w = rows;
  return { widgets: w };
};

export const getWidgetById = async (id: WidgetId) => {
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
};
