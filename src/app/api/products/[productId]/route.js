import { db } from "/src/lib/db";
import { NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

// Get product by id
export async function GET(req, { params }) {
    try {
        // Get product id
        const product = await db.product.findFirst({
            where: {
                id: params.productId,
            },
            include: {
                category: true,
            },
        });

        // Check if product found
        if (!product) {
            return new NextResponse("Product not found", { status: 404 });
        }

        // Return product to client
        return NextResponse.json(product, { status: 200 });
    } catch (err) {
        return new NextResponse("Internal server error", { status: 500 });
    }
}

//  Update product by id
export async function PATCH(req, { params }) {
    try {
      const token = req.headers.get("authorization");

      if (!token) {
        return new NextResponse("Unauthorized", { status: 404 });
        }
        
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);  
        
      const { productId } = params;
  
      const product = await db.product.findFirst({
        where: {
          id: productId,
        },
      });
  
      if (!product) {
        return new NextResponse("Product not found", { status: 404 });
      }
  
      const {
        title,
        price,
        description,
        category_id,
        company,
        shipping,
        stock,
        colors,
        images,
      } = await req.json();
  
      const category = await db.category.findFirst({
        where: {
          id: category_id,
        },
      });
  
      if (!category) {
        return new NextResponse("Category not found", { status: 404 });
      }
  
      const updateProduct = await db.product.update({
        where: {
          id: productId,
        },
        data: {
          company,
          price,
          title,
          description,
          category_id,
          shipping,
          stock,
          colors,
          images,
        },
      });
  
      return NextResponse.json({
        data: updateProduct,
        success: true,
        message: "Update product success",
      });
    } catch (err) {
      // console.log(err);
      // if (err instanceof JsonWebTokenError) {
      //   return new NextResponse("Unauthorized", { status: 401 });
      // } else {
      return new NextResponse("Internal Server Error", { status: 500 });
      // }
    }
  }
  

// Delete product by id
export async function DELETE(req, { params }) {
    try {
        // Token
        const token = req.headers.get("authorization");

        if (!token) {
            return new NextResponse("Unauthorized", { status: 404 });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

        // Get product id
        const { productId } = params;
        const product = await db.product.findFirst({
            where: {
                id: productId,
            },
        });

        // Check if product found
        if (!product) {
            return new NextResponse("Product not found", { status: 404 });
        }

        // Delete product
        await db.product.delete({
            where: {
                id: productId,
            },
        });

        // Return product to client
        return NextResponse.json({
            data: null,
            success: true,
            message: "Product deleted successfully"
        },);
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            return new NextResponse("Unauthorized", { status: 401 })
        } else if (err instanceof PrismaClientKnownRequestError) {
            return new NextResponse("This product cannot be deleted because there are orders associated with it. Please delete the associated orders first before deleting the product.",
              { status: 400 },
            );
        } else {
            return new NextResponse("Internal Server Error", { status: err.status });
        }
    }
}
