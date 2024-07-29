import { connect } from "http2";
import { db } from "/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { rolename } = await req.json();
        const user = await db.user.findMany();

        const roleuser = await db.roleUser.create({
            data: {
                rolename: rolename,
            }
        });

        return NextResponse.json(roleuser, { status: 200 });
    } catch (err) {
        console.log(err)
        return new NextResponse("Internal server error", { status: 500 })
    }
}

export async function GET(req) {
    try {
        const roleuser = await db.roleUser.findMany();

        return NextResponse.json({
            data: roleuser,
            success: true
        },);
    } catch (err) {
        console.log(err);
        return new NextResponse("Internal Server Error", { status: err.status })
    }
}