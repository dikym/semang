import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieItem = { name: string; value: string; options: CookieOptions };

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet: CookieItem[]) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
					supabaseResponse = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				}
			}
		}
	);

	// Refresh session — jangan hapus ini, penting untuk SSR
	const {
		data: { user }
	} = await supabase.auth.getUser();

	const { pathname } = request.nextUrl;

	const isPublicPage =
		pathname.startsWith("/p/") ||
		pathname.startsWith("/api/cron/") ||
		pathname.startsWith("/api/p/");

	const isAuthPage = pathname.startsWith("/masuk") || pathname.startsWith("/daftar");

	if (!user && !isPublicPage && !isAuthPage) {
		const url = request.nextUrl.clone();
		url.pathname = "/masuk";
		return NextResponse.redirect(url);
	}

	if (user && isAuthPage) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
