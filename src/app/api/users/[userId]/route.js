import { NextResponse } from "next/server";
import { db } from "/src/lib/db";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

export async function GET(req, { params }) {
    try {
        const { userId } = params;
        const user = await db.user.findFirst({
            where: {
                id: userId,
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        console.log(err);
        return new NextResponse("Internal server error", { status: err.status });
    }
}

export async function DELETE(req, { params }) {
    try {
        const token = req.headers.get("authorization");

        if (!token) {
            return new NextResponse("Unauthorized", { status: 404 })
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

        const user = await db.user.findFirst({
            where: {
                id: params.userId,
            },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        await db.user.delete({
            where: {
                id: params.userId,
            },
        });

        return NextResponse.json(
            {
                data: null,
                message: "User deleted succesfully"
            },
            {
                status: 200,
            }
        );
    } catch (err) {
        console.log(err);
        if (err instanceof JsonWebTokenError) {
            return new NextResponse("Unauthorized", { status: 401 });
        } else if (err instanceof PrismaClientKnownRequestError) {
            return new NextResponse(
                "This user cannot be deleted because there are orders associated with it. Please delete the associated order first before deleting the user.",
                { status: 400 }
            );
        } else {
            return new NextResponse("Internal  Server Error", { status: 500 });
        }
    }
}