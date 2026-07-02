import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://semang.id";

export default function robots(): MetadataRoute.Robots {
	return {
		sitemap: `${baseUrl}/sitemap.xml`,
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/api/",
				"/login",
				"/register",
				"/p/",
				"/invoices",
				"/queue",
				"/rooms",
				"/settings"
			]
		}
	};
}
