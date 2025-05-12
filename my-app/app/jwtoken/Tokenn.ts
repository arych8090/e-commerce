import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
}

export function signToken(payload: { userid: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET);
}
