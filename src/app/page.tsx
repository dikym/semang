import { redirect } from "next/navigation";

export default function RootPage() {
	// Middleware handle auth redirect; ini fallback
	redirect("/antrean");
}
