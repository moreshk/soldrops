import {
  createWidget,
  deleteWidget,
  updateWidget,
} from "@/lib/trpc-api/widgets/widgets.mutations";
import {
  getWidgetById,
  getWidgets,
} from "@/lib/trpc-api/widgets/widgets.queries";
import {
  insertWidgetParams,
  updateWidgetParams,
  widgetIdSchema,
} from "@/lib/trpc-api/widgets/widgets.type";
import {
  protectedProcedure,
  publicProcedure,
  router,
} from "@/lib/trpc-server/trpc";

export const widgetsRouter = router({
  getWidgets: protectedProcedure.query(async () => {
    return getWidgets();
  }),
  getWidgetById: publicProcedure
    .input(widgetIdSchema)
    .query(async ({ input }) => {
      return getWidgetById(input.id);
    }),
  createWidget: protectedProcedure
    .input(insertWidgetParams)
    .mutation(async ({ input }) => {
      return createWidget(input);
    }),
  updateWidget: protectedProcedure
    .input(updateWidgetParams)
    .mutation(async ({ input }) => {
      return updateWidget(input.id, input);
    }),
  deleteWidget: protectedProcedure
    .input(widgetIdSchema)
    .mutation(async ({ input }) => {
      return deleteWidget(input.id);
    }),
});
