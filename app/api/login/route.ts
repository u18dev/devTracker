import { createSessionToken, SESSION_COOKIE_NAME } from "../../../lib/session";

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return redirectWithStatus("/login?error=config", request.url);
  }

  if (email !== adminEmail || password !== adminPassword) {
    return redirectWithStatus("/login?error=invalid", request.url);
  }

  const token = await createSessionToken(email);

  const redirectUrl = new URL("/dashboard", request.url);

  const headers = new Headers();
  headers.set("Location", redirectUrl.toString());

  headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(
      token
    )}; Path=/; Max-Age=${60 * 60 * 8}; HttpOnly; SameSite=Lax; Secure`
  );

  return new Response(null, {
    status: 303,
    headers,
  });
}

function redirectWithStatus(path: string, baseUrl: string) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(path, baseUrl).toString(),
    },
  });
}