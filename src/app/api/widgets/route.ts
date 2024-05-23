import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createWidget,
  deleteWidget,
  updateWidget,
} from "@/lib/api/widgets/mutations";
import { 
  widgetIdSchema,
  insertWidgetParams,
  updateWidgetParams 
} from "@/lib/db/schema/widgets";

export async function POST(req: Request) {
  try {
    const validatedData = insertWidgetParams.parse(await req.json());
    const { widget } = await createWidget(validatedData);

    revalidatePath("/widgets"); // optional - assumes you will have named route same as entity

    return NextResponse.json(widget, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateWidgetParams.parse(await req.json());
    const validatedParams = widgetIdSchema.parse({ id });

    const { widget } = await updateWidget(validatedParams.id, validatedData);

    return NextResponse.json(widget, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = widgetIdSchema.parse({ id });
    const { widget } = await deleteWidget(validatedParams.id);

    return NextResponse.json(widget, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
