import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const response = NextResponse.next();

    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://thecreeds.site",
    );

    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3000",
    );

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204 });
    }

    return response;
  }

  const currentUser = request.cookies.get("currentUser")?.value;

  if (currentUser) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/user",
    "/category/:path*",
    "/product/:path*",
    "/order/:path*",
    "/api/:path*",
  ],
};
