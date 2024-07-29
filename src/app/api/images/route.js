import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { db } from "@/lib/db";

export const POST = async (req, res) => {
  const formData = await req.formData();
  const files = formData.getAll("files");

  if (!files) {
    return new NextResponse("No files received.", { status: 400 });
  }

  try {
    let images = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + file.name.replaceAll(" ", "_");

      await db.file.create({
        data: {
          filename,
          fileblob: buffer,
        },
      });

      images.push(filename);
    }
    return NextResponse.json({
      images,
    });
  } catch (error) {
    console.log("Error occured ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
