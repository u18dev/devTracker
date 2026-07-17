import { createSessionToken } from "../../../lib/session";

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
    return Response.json(
      { ok: false, error: "Admin login is not configured." },
      { status: 500 }
    );
  }

  if (email !== adminEmail || password !== adminPassword) {
    return Response.json(
      { ok: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(email);

  return Response.json({
    ok: true,
    token,
  });
}