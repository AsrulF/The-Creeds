import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { db } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    await db.file.delete({
      where: {
        id: params.Id,
        filename: params.filename,
      },
    });

    return NextResponse.json(
      {
        data: null,
        message: "Image deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error occurred while deleting file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const file = await db.file.findFirst({
      where: {
        filename: params.filename,
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    const buffer = Buffer.from(file.fileblob);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Contentt-Length": buffer.length,
      },
    });
  } catch (err) {
    console.log("Error fetching images", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
