import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-plus-jakarta",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	preload: false
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://semang.id";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "Semang — Manajemen Kost Otomatis, Tagih & Catat Sendiri",
		template: "%s | Semang"
	},
	description:
		"Kost-mu ditagih otomatis, uang masuk tercatat sendiri, tanpa kamu menagih siapa-siapa.",
	openGraph: {
		title: "Semang — Manajemen Kost Otomatis, Tagih & Catat Sendiri",
		description:
			"Kost-mu ditagih otomatis, uang masuk tercatat sendiri, tanpa kamu menagih siapa-siapa.",
		url: baseUrl,
		siteName: "Semang",
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: "Semang — Manajemen kost otomatis"
			}
		],
		locale: "id_ID",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "Semang — Manajemen Kost Otomatis, Tagih & Catat Sendiri",
		description:
			"Kost-mu ditagih otomatis, uang masuk tercatat sendiri, tanpa kamu menagih siapa-siapa.",
		images: [`${baseUrl}/og-image.png`]
	},
	robots: {
		index: true,
		follow: true
	}
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="id"
			className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				{children}
				{process.env.VERCEL && <SpeedInsights />}
			</body>
		</html>
	);
}
