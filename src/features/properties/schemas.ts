import { z } from "zod";

export const createPropertySchema = z.object({
	name: z.string().min(2, "Nama kost minimal 2 karakter"),
	city: z.string().min(2, "Kota minimal 2 karakter"),
	room_count: z.number().int().min(1).max(50),
	default_rent: z.number().int().positive("Harga sewa harus lebih dari 0"),
	default_due_day: z.number().int().min(1).max(28)
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
