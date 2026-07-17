import { createSessionToken, SESSION_COOKIE_NAME } from "../../../lib/session";

export async function GET() {
  return new Response("API LOGIN ROUTE IS LIVE", {
    status: 200,
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return new Response("Admin login is not configured.", { status: 500 });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return new Response("Invalid email or password.", { status: 401 });
  }

  const token = await createSessionToken(email);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${SESSION_COOKIE_NAME}=${encodeURIComponent(
        token
      )}; Path=/; Max-Age=${60 * 60 * 8}; HttpOnly; SameSite=Lax; Secure`,
    },
  });
}