export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return Response.json({
      hasDatabaseUrl: false,
      error: "DATABASE_URL is missing",
    });
  }

  try {
    const url = new URL(databaseUrl);

    return Response.json({
      hasDatabaseUrl: true,
      protocol: url.protocol,
      host: url.hostname,
      port: url.port,
      database: url.pathname.replace("/", ""),
      search: url.search,
      username: url.username,
      passwordLength: url.password.length,
      fullUrlLength: databaseUrl.length,
    });
  } catch (error) {
    return Response.json({
      hasDatabaseUrl: true,
      error: "DATABASE_URL could not be parsed",
    });
  }
}