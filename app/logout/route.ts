import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "../../lib/session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 303,
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}