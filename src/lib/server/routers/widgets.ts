import { getWidgetById, getWidgets } from "@/lib/api/widgets/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  widgetIdSchema,
  insertWidgetParams,
  updateWidgetParams,
} from "@/lib/db/schema/widgets";
import { createWidget, deleteWidget, updateWidget } from "@/lib/api/widgets/mutations";

export const widgetsRouter = router({
  getWidgets: publicProcedure.query(async () => {
    return getWidgets();
  }),
  getWidgetById: publicProcedure.input(widgetIdSchema).query(async ({ input }) => {
    return getWidgetById(input.id);
  }),
  createWidget: publicProcedure
    .input(insertWidgetParams)
    .mutation(async ({ input }) => {
      return createWidget(input);
    }),
  updateWidget: publicProcedure
    .input(updateWidgetParams)
    .mutation(async ({ input }) => {
      return updateWidget(input.id, input);
    }),
  deleteWidget: publicProcedure
    .input(widgetIdSchema)
    .mutation(async ({ input }) => {
      return deleteWidget(input.id);
    }),
});
