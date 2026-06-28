import { z } from "zod";

export const loginSchema = z.object({
	identifier: z.string().min(1, "Email atau nomor WA wajib diisi"),
	password: z.string().min(8, "Password minimal 8 karakter")
});

export const registerSchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter"),
	email: z.string().email("Format email tidak valid"),
	phone_wa: z.string().regex(/^\+62\d{9,13}$/, "Format nomor WA: +62xxxxxxxxx"),
	password: z.string().min(8, "Password minimal 8 karakter")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
