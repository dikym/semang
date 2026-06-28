import { z } from "zod";

export const createAdHocInvoiceSchema = z.object({
	room_id: z.string().uuid(),
	tenant_id: z.string().uuid(),
	amount: z.number().int().positive(),
	description: z.string().min(1),
	due_date: z.string().date()
});

export type CreateAdHocInvoiceInput = z.infer<typeof createAdHocInvoiceSchema>;
