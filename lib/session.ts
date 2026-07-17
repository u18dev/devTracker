import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "devicetrack_session";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not set.");
}

const encodedSecret = new TextEncoder().encode(secret);

export async function createSessionToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(encodedSecret);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);

    return {
      email: String(payload.email || ""),
    };
  } catch {
    return null;
  }
}