import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/cron";

export async function GET(request: NextRequest) {
	if (!verifyCronSecret(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ ok: true, message: "Belum diimplementasikan" });
}
