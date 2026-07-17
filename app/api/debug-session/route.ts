import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../../../lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({
      hasCookie: false,
      sessionValid: false,
      message: "No devicetrack_session cookie found.",
    });
  }

  const session = await verifySessionToken(token);

  return NextResponse.json({
    hasCookie: true,
    sessionValid: Boolean(session?.email),
    email: session?.email || null,
  });
}