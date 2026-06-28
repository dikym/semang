import { createHash, randomBytes, timingSafeEqual } from "crypto";

export function generateToken(): string {
	return randomBytes(32).toString("base64url");
}

export async function hashToken(token: string): Promise<string> {
	return createHash("sha256").update(token).digest("hex");
}

export async function verifyToken(token: string, storedHash: string): Promise<boolean> {
	const hash = await hashToken(token);
	const a = Buffer.from(hash, "hex");
	const b = Buffer.from(storedHash, "hex");
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
