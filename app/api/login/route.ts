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
    return redirectTo("/login?error=config", request.url);
  }

  if (email !== adminEmail || password !== adminPassword) {
    return redirectTo("/login?error=invalid", request.url);
  }

  const token = await createSessionToken(email);

  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/dashboard", request.url).toString(),
      "Set-Cookie": `${SESSION_COOKIE_NAME}=${encodeURIComponent(
        token
      )}; Path=/; Max-Age=28800; HttpOnly; SameSite=Lax; Secure`,
    },
  });
}

function redirectTo(path: string, baseUrl: string) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(path, baseUrl).toString(),
    },
  });
}