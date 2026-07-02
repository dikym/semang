const guarantees = [
	"Uang langsung ke rekeningmu",
	"Tanpa install aplikasi",
	"Siap pakai <10 menit"
];

export function Hero() {
	return (
		<header id="top" className="container py-10 md:py-14 lg:py-18">
			<div className="flex flex-wrap items-center gap-x-14 md:gap-y-8 lg:flex-nowrap">
				{/* Copy */}
				<div className="min-w-0 flex-1 basis-95">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-100 px-3.5 py-1.5">
						<span className="size-1.5 rounded-full bg-teal-500" />
						<span className="text-xs font-bold tracking-wider text-teal-700 uppercase">
							Pengganti buku catatan &amp; WhatsApp
						</span>
					</div>
					<h1 className="mb-5 text-[clamp(2.125rem,5.2vw,3.375rem)] leading-none font-extrabold tracking-tight text-balance text-teal-900">
						Kost-mu ditagih otomatis, uang masuk tercatat sendiri.
					</h1>
					<p className="text-warm-600 mb-8 max-w-130 text-lg leading-relaxed text-pretty sm:text-xl">
						Tanpa kamu menagih siapa-siapa. Semang menyiapkan pesan tagihan WhatsApp
						atas nama kost-mu, mencatat tiap pembayaran, dan merapikan semuanya —
						pengganti buku catatan &amp; chat pribadi.
					</p>
					<div className="mb-7 flex flex-wrap gap-3">
						<a
							href="#try-it-for-free"
							className="rounded-md bg-teal-500 px-6.5 py-4 text-base font-bold text-white shadow-[0_6px_18px_rgba(60,131,119,0.28)] transition-colors hover:bg-teal-600"
						>
							Mulai gratis · ≤5 kamar
						</a>
						<a
							href="#how-it-works"
							className="rounded-md border-2 border-teal-200 bg-white px-6.5 py-4 text-base font-bold text-teal-700 transition-colors hover:bg-teal-50"
						>
							Lihat cara kerja
						</a>
					</div>
					<ul className="flex flex-wrap items-center gap-x-5.5 gap-y-3">
						{guarantees.map((item) => (
							<li key={item} className="flex items-center gap-2">
								<span className="bg-success-bg text-success flex size-4.5 items-center justify-center rounded-full text-xs font-extrabold">
									✓
								</span>
								<span className="text-warm-600 text-sm font-semibold">{item}</span>
							</li>
						))}
					</ul>
				</div>

				{/* WhatsApp phone mockup */}
				<div className="relative flex flex-1 basis-75 justify-center">
					<div
						aria-hidden
						className="absolute top-1/2 left-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/70 blur-[80px]"
					/>
					<PhoneMockup />
				</div>
			</div>
		</header>
	);
}

function PhoneMockup() {
	return (
		<div className="relative z-1 hidden aspect-9/19.5 w-74 rounded-[46px] bg-teal-900 p-2.5 shadow-[0_2px_6px_rgba(27,58,54,0.2),0_18px_36px_rgba(27,58,54,0.22),0_40px_80px_rgba(27,58,54,0.18)] md:block">
			<div className="flex h-full flex-col overflow-hidden rounded-[36px] bg-[#ece5dd]">
				{/* WA header */}
				<div className="flex items-center gap-2.5 bg-teal-700 px-4 pt-4 pb-3.5">
					<span className="text-lg text-teal-200">‹</span>
					<span className="flex size-8.5 items-center justify-center rounded-full bg-teal-500 text-sm font-extrabold text-white">
						KM
					</span>
					<div className="min-w-0 flex-1">
						<div className="text-sm font-bold text-white">Kost Melati</div>
						<div className="text-xs text-teal-300">online</div>
					</div>
				</div>
				{/* Chat */}
				<div className="flex flex-1 flex-col gap-2.5 px-3.5 py-4.5">
					<div className="max-w-[88%] self-start rounded-[4px_14px_14px_14px] bg-white px-3.5 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
						<div className="mb-1.5 text-sm font-extrabold text-teal-700">
							🧾 Tagihan Juni 2026 · Kamar 3
						</div>
						<div className="text-warm-900 text-sm leading-normal">
							Halo Rara 👋 Tagihan sewa bulan ini:
							<br />
							<b>Rp1.500.000</b>
							<br />
							<br />
							Transfer ke BCA 1234567890 a.n. Bu Sari, lalu unggah bukti di tautan
							ini:
						</div>
						<div className="text-info mt-2 text-xs font-semibold break-all">
							semang.id/p/proof/k3-92fa
						</div>
						<div className="text-warm-400 mt-1 text-right text-xs">09.41 ✓✓</div>
					</div>
					<div className="max-w-[80%] self-end rounded-[14px_4px_14px_14px] bg-teal-100 px-3.5 py-2.75">
						<div className="text-sm leading-normal text-teal-800">
							Sudah transfer ya bu 🙏 bukti sudah saya upload
						</div>
						<div className="mt-1 text-right text-xs text-teal-600">09.46</div>
					</div>
					<div className="max-w-[88%] self-start rounded-[14px] bg-white px-3.5 py-2.75 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
						<div className="text-warm-900 text-sm leading-normal">
							Bukti diterima. Kuitansi Juni sudah dikirim ke kamu ya, terima kasih 🙏
						</div>
						<div className="text-warm-400 mt-1 text-right text-xs">09.47</div>
					</div>
				</div>
			</div>
		</div>
	);
}
