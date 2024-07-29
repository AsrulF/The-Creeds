import { db } from "/src/lib/db";
import { NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

// Get all products
export async function GET(req) {
    try {
        // Get all product
        const product = await db.product.findMany({
            include: {
                category: true,
            },
        });

        // Return product to the client
        return NextResponse.json(product, { status: 200 });
    } catch (err) {
        return new NextResponse("Internal Server Error", { status: err.status });
    }
}
// Create a new product
export async function POST(req) {
    try {
        // Token
        const token = req.headers.get("authorization");

        if (!token) {
            return new NextResponse("Unauthorized", { status: 404 });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        // Get title form product
        const { title, price, description, category_id, company, stock, colors, images } = await req.json();

        // Guard
        const category = await db.category.findFirst({
            where: {
                id: category_id,
            },
        });

        if (!category) {
            return new NextResponse("Category Not Found", { status: 404 });
        };

        // Create product with prisma
        const product = await db.product.create({
            data: {
                title: title,
                price: price,
                description: description,
                category_id: category_id,
                company: company,
                stock: stock,
                colors: colors,
                images: images
            },
        });
        // Return product to client
        return NextResponse.json({
            data: product,
            success: true,
            message: "Product created succesfully"
        }, 
        { 
            status: 201 
        });
    } catch(err) {
        console.log(err);
        if (err instanceof JsonWebTokenError) {
            return new NextResponse("Unauthorized", { status: 401 })
        } else {
            // Return error reponse
            return new NextResponse("Internal Server Error", { status: err.status});
        }
    };
}
