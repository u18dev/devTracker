import dns from "node:dns/promises";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return Response.json({
      ok: false,
      error: "DATABASE_URL is missing",
    });
  }

  const url = new URL(databaseUrl);
  const host = url.hostname;

  try {
    const result = await dns.lookup(host);

    return Response.json({
      ok: true,
      host,
      address: result.address,
      family: result.family,
      port: url.port,
      database: url.pathname.replace("/", ""),
      username: url.username,
      passwordLength: url.password.length,
    });
  } catch (error) {
    return Response.json({
      ok: false,
      host,
      port: url.port,
      database: url.pathname.replace("/", ""),
      username: url.username,
      passwordLength: url.password.length,
      error: error instanceof Error ? error.message : "Unknown DNS error",
    });
  }
}