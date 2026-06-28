import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ ok: true, message: "Belum diimplementasikan" });
}
