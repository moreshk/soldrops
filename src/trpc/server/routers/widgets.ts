import {
  createWidget,
  deleteWidget,
  updateWidget,
} from "@/trpc/server/actions/widgets/widgets.mutations";
import {
  getWidgetById,
  getWidgets,
} from "@/trpc/server/actions/widgets/widgets.queries";
import {
  insertWidgetParams,
  updateWidgetParams,
  widgetIdSchema,
} from "@/trpc/server/actions/widgets/widgets.type";
import { protectedProcedure, publicProcedure, router } from "@/trpc/server";

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
