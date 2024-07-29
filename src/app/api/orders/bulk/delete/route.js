import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { ids } = await request.json();

    await db.$transaction(async (ctx) => {
      for (const id of ids) {
        await ctx.order.delete({
          where: {
            id,
          },
        });
      }
    });

    return NextResponse.json({
      data: null,
      message: "Bulk delete success",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}