import { ArrowRightLeft, ClipboardX, Frown } from "lucide-react";
import { SectionHeading } from "./section-heading";

const problems = [
	{
		icon: Frown,
		iconBg: "bg-danger-bg text-danger",
		title: "Sungkan menagih",
		body: "Menagih sewa lewat chat pribadi terasa tidak enak, jadi ditunda-tunda — dan tunggakan pun menumpuk."
	},
	{
		icon: ClipboardX,
		iconBg: "bg-warning-bg text-warning-fg",
		title: "Catatan berantakan",
		body: "Bukti transfer terselip di chat, KTP tercecer, dan tiap akhir bulan harus mengingat-ingat siapa yang sudah bayar."
	},
	{
		icon: ArrowRightLeft,
		iconBg: "bg-info-bg text-info-fg",
		title: "Pembayaran nyasar",
		body: "Transfer masuk tanpa keterangan, lalu harus mencocokkan mutasi rekening satu per satu dengan penghuni."
	}
];

export function Problems() {
	return (
		<section id="problems" className="container scroll-mt-16 py-10 md:py-14 lg:py-18">
			<SectionHeading
				eyebrow="Tiga hal yang paling melelahkan"
				title="Mengelola kost pakai buku catatan & chat itu capek"
				description="Semang dirancang langsung dari tiga keluhan terbesar pemilik kost di Indonesia."
			/>
			<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{problems.map((problem) => (
					<article
						key={problem.title}
						className="border-border bg-card shadow-warm-sm rounded-xl border p-7.5"
					>
						<div
							className={`mb-4.5 flex size-12 items-center justify-center rounded-lg ${problem.iconBg}`}
						>
							<problem.icon className="size-6" strokeWidth={2} />
						</div>
						<h3 className="text-warm-900 mb-2.5 text-lg font-bold">{problem.title}</h3>
						<p className="text-warm-600 text-base leading-relaxed">{problem.body}</p>
					</article>
				))}
			</div>
		</section>
	);
}
