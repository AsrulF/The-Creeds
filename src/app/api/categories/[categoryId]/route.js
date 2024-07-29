import { NextResponse } from "next/server";
import { db } from "/src/lib/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export async function GET(req, { params }) {
    try {
        // Get category by id
        const category = await db.category.findFirst(
            {
                where: {
                    id: params.categoryId,
                },
            }
        );
        // Check if category is found
        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        // Return category to the client
        return NextResponse.json(category, { status: 200 });
    } catch (err) {
        // Return error response
        return new NextResponse("Internal Server Error", { status: err.status });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { name } = await req.json();
        const category = await db.category.findFirst({
            where: {
                id: params.categoryId,
            }
        });

        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        const updateCategory = await db.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name: name,
            },
        });

        return NextResponse.json(updateCategory, { status: 200 });
    } catch (err) {
        return new NextResponse("Internal Server Error", { status: err.status });
    }
}

export async function DELETE(req, { params }) {
    try {
      
      const token = req.headers.get("authorization");

      if (!token) {
          return new NextResponse("Unauthorized", { status: 404 });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      
      const category = await db.category.findFirst({
        where: {
          id: params.categoryId,
        },
      });
  
      if (!category) {
        return new NextResponse("Category not found", { status: 404 });
      }
  
      await db.category.delete({
        where: {
          id: params.categoryId,
        },
      });
  
      return NextResponse.json(
        {
          data: null,
          message: "Category deleted successfully",
        },
        {
          status: 200,
        },
      );
    } catch (err) {
      console.log(err);
      if (err instanceof JsonWebTokenError) {
        return new NextResponse("Unauthorized", { status: 401 });
      } else if (err instanceof PrismaClientKnownRequestError) {
        return new NextResponse(
          "This category cannot be deleted because there are products associated with it. Please delete the associated products first before deleting the category.",
          { status: 400 },
        );
      } else {
        return new NextResponse("Internal  Server Error", { status: 500 });
      }
    }
  }