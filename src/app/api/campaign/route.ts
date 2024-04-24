import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "@/lib/api/campaign/mutations";
import { 
  campaignIdSchema,
  insertCampaignParams,
  updateCampaignParams 
} from "@/lib/db/schema/campaign";

export async function POST(req: Request) {
  try {
    const validatedData = insertCampaignParams.parse(await req.json());
    const { campaign } = await createCampaign(validatedData);

    revalidatePath("/campaign"); // optional - assumes you will have named route same as entity

    return NextResponse.json(campaign, { status: 201 });
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

    const validatedData = updateCampaignParams.parse(await req.json());
    const validatedParams = campaignIdSchema.parse({ id });

    const { campaign } = await updateCampaign(validatedParams.id, validatedData);

    return NextResponse.json(campaign, { status: 200 });
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

    const validatedParams = campaignIdSchema.parse({ id });
    const { campaign } = await deleteCampaign(validatedParams.id);

    return NextResponse.json(campaign, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
