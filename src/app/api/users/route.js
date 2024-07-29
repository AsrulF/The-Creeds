import { db } from "/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, email, password, role } = await req.json();

        // Create user
        const user = await db.user.create({
            data: {
                name: name,
                email: email,
                password: password,
                role: role
            },
        });
        return NextResponse.json(user, { status: 201 });
    } catch(err) {
        console.log(err)
        return new NextResponse("Internal Server Error", { status: err.status})
    }
}

export async function GET(req) {
    try {
        const user = await db.user.findMany();

        return NextResponse.json(
            {
                data: user,
                success: true,
            },
        );
    } catch (err) {
        console.log(err);
        return new NextResponse("Internal Server Error", { status: err.status });
    }
}