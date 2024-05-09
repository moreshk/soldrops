import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createToken,
  deleteToken,
  updateToken,
} from "@/lib/api/tokens/mutations";
import { 
  tokenIdSchema,
  insertTokenParams,
  updateTokenParams 
} from "@/lib/db/schema/tokens";

export async function POST(req: Request) {
  try {
    const validatedData = insertTokenParams.parse(await req.json());
    const { token } = await createToken(validatedData);

    revalidatePath("/tokens"); // optional - assumes you will have named route same as entity

    return NextResponse.json(token, { status: 201 });
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

    const validatedData = updateTokenParams.parse(await req.json());
    const validatedParams = tokenIdSchema.parse({ id });

    const { token } = await updateToken(validatedParams.id, validatedData);

    return NextResponse.json(token, { status: 200 });
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

    const validatedParams = tokenIdSchema.parse({ id });
    const { token } = await deleteToken(validatedParams.id);

    return NextResponse.json(token, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
