import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
