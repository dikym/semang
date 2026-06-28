import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
