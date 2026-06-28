export type { Database, Json } from "./database";

export type InvoiceStatus =
	"draft" | "terjadwal" | "terkirim" | "menunggu_konfirmasi" | "lunas" | "telat" | "menunggak";

export type ProofStatus = "pending" | "diterima" | "ditolak";

export type PaymentSource = "manual_transfer" | "qris";

export type NotificationKind = "tagihan" | "h_minus_3" | "hari_h" | "h_plus_3" | "h_plus_7";

export type NotificationChannel = "wa_link" | "waba" | "email";

export type TokenKind = "isi_mandiri" | "upload" | "kuitansi";
