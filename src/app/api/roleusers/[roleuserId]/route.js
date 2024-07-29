import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(req, { params }) {
    try {
        const roleUser = await db.roleUser.findFirst({
            where: {
                id: params.roleUserId,
            }
        });

        if (!roleUser) {
            return new NextResponse("Role not found", { status: 404});
        }

        return NextResponse.json(roleUser, { status: 200 });
    } catch (err) {
        return new NextResponse("Internal server error", { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    try {
        const { roleuserId } = params
        const token = req.headers.get("authorization");

        if (!token) {
            return new NextResponse("Unauthorized", { status: 404 })
        }

        const decode = jwt.verify(token, process.env.JWT_ACCESS_KEY);

        const roleUser = await db.roleUser.findFirst({
            where: {
                id: roleuserId
            },
        });

        if (!roleUser) {
            return new NextResponse("Role not found", { status: 404 });
        }

        await db.roleUser.delete({
            where: {
                id: roleuserId
            }
        });

        return NextResponse.json({
            data: null,
            success: true,
            message: "Role deleted successfully"
        })
    } catch (err) {
        console.log(err);
        if (err instanceof JsonWebTokenError) {
            return new NextResponse("Unauthorized", { status: 401})
        } else {
            return new NextResponse("Internal server error", { status: 500 })
        }
    }
}