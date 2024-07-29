import { db } from "/src/lib/db";
import { NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export async function POST(req) {
    try {
        const token = req.headers.get("authorization");

        if (!token) {
            return new NextResponse("Unauthorized", { status: 404 });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

        const user = await db.user.findFirst({
            where: {
                id: decoded.id
            },
            include: {
                role: true
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        if (user.role.rolename !== "ADMIN") {
            return new NextResponse("This account is not ADMIN", { status: 401})
        }

        // Tangkap nilai di body
        const body = await req.json();

        // Insert new data to categories
        const category = await db.category.create(
            {
                data: {
                    name: body.name
                }
            }
        );

        // Return to client
        return NextResponse.json(
            {
            data: category,
            success: true,
            message: "Category created",
            },
            {
                status: 200,
            },
        );
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            return new NextResponse("Unauthorized", { status: 401 })
        } else {
            console.log(err);
            return new NextResponse("Internal Server Error", {
                status: 500,
            });
        }
        
    }
}

export async function GET(req) {
    try {
        // Get All Categories
        const categories = await db.category.findMany();

        // Return category to the client
        return NextResponse.json(categories, { status: 200 });
    } catch(err) {
        // Return error response
        return new NextResponse("Internal Server Error", { status: err.status })
    }
}