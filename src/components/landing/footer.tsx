import Image from "next/image";

const columns = [
	{
		title: "Produk",
		links: [
			{ href: "#problems", label: "Masalah" },
			{ href: "#how-it-works", label: "Cara kerja" },
			{ href: "#features", label: "Fitur" },
			{ href: "#pricing", label: "Harga" }
		]
	},
	{
		title: "Perusahaan",
		links: [
			{ href: "#", label: "Tentang" },
			{ href: "#", label: "Privasi" },
			{ href: "#", label: "Kontak" }
		]
	}
];

export function Footer() {
	return (
		<footer className="border-border border-t">
			<div className="container py-8 md:py-12">
				<div className="mb-9 flex flex-wrap justify-between gap-8">
					<div className="max-w-75">
						<div className="mb-3.5 flex items-center gap-2.75">
							<Image src="/logo.svg" alt="Semang" width={36} height={36} className="size-9 rounded-md" />
							<span className="text-lg font-extrabold tracking-tight text-teal-900">
								Semang
							</span>
						</div>
						<p className="text-warm-500 text-sm leading-relaxed">
							Cara paling sederhana menagih, mencatat, dan mengelola kost — dimulai
							dari yang masih pakai buku tulis.
						</p>
					</div>
					<div className="flex w-full flex-wrap justify-between gap-14 md:max-w-60">
						{columns.map((column) => (
							<nav key={column.title}>
								<div className="text-warm-400 mb-3.5 text-xs font-bold tracking-wider uppercase">
									{column.title}
								</div>
								<ul className="flex flex-col gap-2.5">
									{column.links.map((link) => (
										<li key={link.label}>
											<a
												href={link.href}
												className="text-warm-700 text-sm font-semibold transition-colors hover:text-teal-500"
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</nav>
						))}
					</div>
				</div>
				<div className="border-border flex flex-wrap justify-between gap-3 border-t pt-6">
					<span className="text-warm-400 text-sm font-medium">© 2026 Semang</span>
					<span className="text-warm-400 text-sm font-medium">
						Dibuat untuk pemilik kost Indonesia 🇮🇩
					</span>
				</div>
			</div>
		</footer>
	);
}
