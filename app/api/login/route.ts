import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME } from "../../../lib/session";

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  const token = await createSessionToken(email);

  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}