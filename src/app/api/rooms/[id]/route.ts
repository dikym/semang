import { NextResponse } from "next/server";

export async function PATCH() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
