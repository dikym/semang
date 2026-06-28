import { timingSafeEqual } from "crypto";
import { type NextRequest } from "next/server";

export function verifyCronSecret(request: NextRequest): boolean {
	const secret = process.env.CRON_SECRET;
	const header = request.headers.get("x-cron-secret");
	if (!secret || !header) return false;
	const a = Buffer.from(secret);
	const b = Buffer.from(header);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
