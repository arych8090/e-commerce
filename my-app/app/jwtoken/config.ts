export const GOOGLE_ID = process.env.GOOGLE_ID as string;
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const APPLE_ID = process.env.APPLE_ID as string;
export const APPLE_SECRET = process.env.APPLE_SECRET as string;

if (!GOOGLE_ID || !GOOGLE_SECRET || !JWT_SECRET || !APPLE_ID || !APPLE_SECRET) {
    throw new Error("Missing required environment variables");
  }