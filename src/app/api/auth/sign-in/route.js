import { compareSync } from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req, res) {
  try {
    const { email, password } = await req.json();

    const user = await db.user.findFirst({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User does not exist",
        },
        {
          status: 400,
        },
      );
    }

    if (!compareSync(password, user.password)) {
      return new NextResponse("Password is incorrect", { status: 401 });
    }

    if (user.role.rolename !== "ADMIN") {
      return new NextResponse("You are not authorized to access this route", {
        status: 401,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "7d",
    });

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        access_token: token,
      },
    });

    delete user.password;
    delete user.access_token;

    return NextResponse.json({
      ...user,
      token,
    });
  } catch (err) {
    console.log(err);

    return new NextResponse(err?.message || "Internal Server Error", {
      status: 500,
    });
  }
}
