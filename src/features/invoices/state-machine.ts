import type { InvoiceStatus } from "@/types";

type Transition = {
	from: InvoiceStatus;
	to: InvoiceStatus;
};

// Transisi valid sesuai TRD §5.1
const VALID_TRANSITIONS: Transition[] = [
	{ from: "draft", to: "terjadwal" },
	{ from: "terjadwal", to: "terkirim" },
	{ from: "terkirim", to: "menunggu_konfirmasi" },
	{ from: "menunggu_konfirmasi", to: "lunas" },
	{ from: "menunggu_konfirmasi", to: "terkirim" },
	{ from: "terkirim", to: "telat" },
	{ from: "telat", to: "menunggak" }
];

export function isValidTransition(from: InvoiceStatus, to: InvoiceStatus): boolean {
	return VALID_TRANSITIONS.some((t) => t.from === from && t.to === to);
}
