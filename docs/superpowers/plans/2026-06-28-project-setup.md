# Semang Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold proyek Semang dari nol — Next.js 15, Tailwind v4, shadcn/ui, Supabase, semua lib/feature stubs, SQL migrations 18 tabel, dan konfigurasi deployment Vercel.

**Architecture:** Monolith Next.js 15 App Router di Vercel Hobby, Supabase sebagai database + auth + storage, feature-based folder di `src/features/`, route handlers tipis yang delegate ke features.

**Tech Stack:** Next.js 15, TypeScript 5, bun, Tailwind CSS v4, shadcn/ui, @supabase/supabase-js v2, @supabase/ssr, Zod v3, Resend v4, browser-image-compression v2.

## Global Constraints

- Package manager: **bun** — semua install/run pakai `bun`, bukan npm/pnpm/yarn
- Tailwind versi **v4** — tidak ada `tailwind.config.js`, pakai CSS-first config
- TypeScript strict mode aktif
- Semua file bahasa Indonesia untuk copy/label UI, bukan Inggris
- Import alias: `@/*` → `src/*`
- Tidak ada co-authored-by di commit messages
- Conventional Commits untuk setiap commit

---

## File Map

| File | Tanggung Jawab |
|---|---|
| `src/middleware.ts` | Auth guard + route protection |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/supabase/server.ts` | Server Supabase client (RSC/Server Actions) |
| `src/lib/supabase/middleware.ts` | Session refresh di edge |
| `src/lib/tokens.ts` | Generate + verify public tokens (≥128 bit) |
| `src/lib/utils.ts` | `cn()`, `formatRupiah()` |
| `src/types/database.ts` | Placeholder untuk Supabase generated types |
| `src/types/index.ts` | Re-export + custom types |
| `src/features/notifications/types.ts` | `NotificationSender` interface |
| `src/features/notifications/wa-link.ts` | `WaLinkSender` implementasi Tahap 0 |
| `src/features/notifications/email.ts` | `EmailSender` via Resend |
| `src/features/*/actions.ts` | Server Actions per domain |
| `src/features/*/schemas.ts` | Zod schemas per domain |
| `src/app/**/page.tsx` | Page stubs per route |
| `src/app/api/**/route.ts` | Route handler stubs |
| `supabase/migrations/20260628000001_init_schema.sql` | 18 tabel + indexes + triggers |
| `supabase/migrations/20260628000002_rls_policies.sql` | RLS policies semua tabel |
| `supabase/seed.sql` | Data plans tier |
| `vercel.json` | Cron schedule 4 jobs |
| `.env.example` | Template env vars |

---

## Task 1: Scaffold Next.js 15

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Modify: `.prettierrc` (hapus Svelte plugins)

**Interfaces:**
- Produces: working `bun dev` dan `bun build`

- [ ] **Step 1: Scaffold dengan create-next-app**

Jalankan dari direktori project (`/Users/dikym/Code/side/semang`):

```bash
bunx create-next-app@latest . \
  --typescript \
  --eslint \
  --tailwind \
  --src-dir \
  --app \
  --import-alias "@/*" \
  --use-bun \
  --no-git
```

Jika ditanya "Would you like to use Turbopack?" → jawab **No**.

Expected output: "Success! Created semang at ..."

- [ ] **Step 2: Update .prettierrc — hapus Svelte plugins**

Ganti seluruh isi `.prettierrc`:

```json
{
	"useTabs": true,
	"semi": true,
	"singleQuote": false,
	"tabWidth": 4,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Verifikasi build awal berjalan**

```bash
bun run build
```

Expected: `✓ Compiled successfully` atau `Route (app)` table tanpa error.

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: initial next.js 15 scaffold"
```

---

## Task 2: Upgrade Tailwind CSS ke v4

**Files:**
- Modify: `src/app/globals.css`
- Modify: `postcss.config.mjs`
- Delete: `tailwind.config.ts` (jika ada)

**Interfaces:**
- Produces: Tailwind v4 berjalan, class utility tersedia di semua komponen

- [ ] **Step 1: Hapus Tailwind v3 + install v4**

```bash
bun remove tailwindcss @tailwindcss/postcss autoprefixer 2>/dev/null; bun add tailwindcss@^4 @tailwindcss/postcss@^4
```

- [ ] **Step 2: Update postcss.config.mjs**

```js
const config = {
	plugins: {
		"@tailwindcss/postcss": {}
	}
};

export default config;
```

- [ ] **Step 3: Hapus tailwind.config.ts jika ada**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

- [ ] **Step 4: Update src/app/globals.css**

```css
@import "tailwindcss";

:root {
	--background: #ffffff;
	--foreground: #171717;
}

@media (prefers-color-scheme: dark) {
	:root {
		--background: #0a0a0a;
		--foreground: #ededed;
	}
}

body {
	background: var(--background);
	color: var(--foreground);
	font-family: Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 5: Verifikasi Tailwind v4 aktif**

```bash
bun run build
```

Expected: build sukses, tidak ada error `tailwindcss`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: upgrade tailwind css to v4"
```

---

## Task 3: Install shadcn/ui

**Files:**
- Create: `src/components/ui/` (diisi shadcn init)
- Modify: `src/app/globals.css` (shadcn tambah CSS variables)
- Create: `components.json`

**Interfaces:**
- Produces: `cn()` utility, shadcn component infrastructure siap, `bun shadcn add <component>` bisa dipakai

- [ ] **Step 1: Init shadcn**

```bash
bunx shadcn@latest init
```

Saat ditanya:
- Style → **Default**
- Base color → **Neutral**
- CSS variables → **Yes**

shadcn akan update `globals.css` dan buat `components.json`.

- [ ] **Step 2: Verifikasi components.json ada**

```bash
cat components.json
```

Expected: JSON dengan `"tailwind": { "css": "src/app/globals.css" }` atau serupa.

- [ ] **Step 3: Test tambah satu komponen**

```bash
bunx shadcn@latest add button
```

Expected: `src/components/ui/button.tsx` ter-generate.

- [ ] **Step 4: Verifikasi build**

```bash
bun run build
```

Expected: sukses.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add shadcn/ui"
```

---

## Task 4: Install semua dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: semua runtime deps tersedia untuk di-import

- [ ] **Step 1: Install runtime dependencies**

```bash
bun add \
  @supabase/supabase-js@^2 \
  @supabase/ssr@^0.6 \
  zod@^3 \
  resend@^4 \
  browser-image-compression@^2
```

- [ ] **Step 2: Install dev dependencies**

```bash
bun add -D supabase@^2
```

- [ ] **Step 3: Verifikasi semua terinstall**

```bash
bun run build
```

Expected: sukses tanpa "Cannot find module" errors.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lockb
git commit -m "chore: add supabase, zod, resend, browser-image-compression"
```

---

## Task 5: Konfigurasi Supabase client + middleware

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/middleware.ts`
- Create: `src/types/database.ts`
- Create: `src/types/index.ts`
- Create: `.env.example`

**Interfaces:**
- Produces:
  - `createClient()` dari `@/lib/supabase/client` — browser client
  - `createClient()` dari `@/lib/supabase/server` — server client (async)
  - `updateSession(request)` dari `@/lib/supabase/middleware`
  - `middleware(request)` di `src/middleware.ts` — auth guard

- [ ] **Step 1: Buat src/types/database.ts**

Placeholder sampai `supabase gen types` dijalankan setelah Supabase project dibuat:

```typescript
// Generated types akan di-replace dengan: bunx supabase gen types typescript --project-id <id> > src/types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: Record<string, never>;
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
}
```

- [ ] **Step 2: Buat src/types/index.ts**

```typescript
export type { Database, Json } from "./database";

export type InvoiceStatus =
	| "draft"
	| "terjadwal"
	| "terkirim"
	| "menunggu_konfirmasi"
	| "lunas"
	| "telat"
	| "menunggak";

export type ProofStatus = "pending" | "diterima" | "ditolak";

export type PaymentSource = "manual_transfer" | "qris";

export type NotificationKind = "tagihan" | "h_minus_3" | "hari_h" | "h_plus_3" | "h_plus_7";

export type NotificationChannel = "wa_link" | "waba" | "email";

export type TokenKind = "isi_mandiri" | "upload" | "kuitansi";
```

- [ ] **Step 3: Buat src/lib/supabase/client.ts**

```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
```

- [ ] **Step 4: Buat src/lib/supabase/server.ts**

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// Server Component — cookies read-only, diabaikan
					}
				}
			}
		}
	);
}
```

- [ ] **Step 5: Buat src/lib/supabase/middleware.ts**

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
					supabaseResponse = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				}
			}
		}
	);

	// Refresh session — jangan hapus ini, penting untuk SSR
	const {
		data: { user }
	} = await supabase.auth.getUser();

	const { pathname } = request.nextUrl;

	const isPublicPage =
		pathname.startsWith("/p/") ||
		pathname.startsWith("/api/cron/") ||
		pathname.startsWith("/api/p/");

	const isAuthPage = pathname.startsWith("/masuk") || pathname.startsWith("/daftar");

	if (!user && !isPublicPage && !isAuthPage) {
		const url = request.nextUrl.clone();
		url.pathname = "/masuk";
		return NextResponse.redirect(url);
	}

	if (user && isAuthPage) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
```

- [ ] **Step 6: Buat src/middleware.ts**

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
	]
};
```

- [ ] **Step 7: Buat .env.example**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Resend
RESEND_API_KEY=re_<key>
RESEND_FROM_EMAIL=notif@semang.id

# Cron security — random 32+ karakter
CRON_SECRET=<random-secret>

# App
NEXT_PUBLIC_APP_URL=https://semang.id
```

- [ ] **Step 8: Buat .env.local dari template**

```bash
cp .env.example .env.local
```

- [ ] **Step 9: Verifikasi TypeScript tidak error**

```bash
bun run build
```

Expected: sukses (env vars `!` assertions OK saat build tanpa nilai asli).

- [ ] **Step 10: Commit**

```bash
git add src/lib/supabase/ src/middleware.ts src/types/ .env.example .env.local
git commit -m "feat(supabase): add client, server, middleware setup"
```

---

## Task 6: Core lib utilities

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/tokens.ts`

**Interfaces:**
- Produces:
  - `cn(...inputs: ClassValue[]): string` — merge Tailwind classes
  - `formatRupiah(amount: number): string` — format IDR
  - `generateToken(): string` — 32-byte random token (base64url)
  - `hashToken(token: string): Promise<string>` — SHA-256 hex hash
  - `verifyToken(token: string, hash: string): Promise<boolean>` — constant-time compare

- [ ] **Step 1: Buat src/lib/utils.ts**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}
```

- [ ] **Step 2: Buat src/lib/tokens.ts**

Token 32 byte (256 bit) disimpan sebagai SHA-256 hash di DB (NFR-03, TRD §9).

```typescript
import { randomBytes, createHash, timingSafeEqual } from "crypto";

export function generateToken(): string {
	return randomBytes(32).toString("base64url");
}

export async function hashToken(token: string): Promise<string> {
	return createHash("sha256").update(token).digest("hex");
}

export async function verifyToken(token: string, storedHash: string): Promise<boolean> {
	const hash = await hashToken(token);
	const a = Buffer.from(hash, "hex");
	const b = Buffer.from(storedHash, "hex");
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
```

- [ ] **Step 3: Verifikasi TypeScript**

```bash
bun run build
```

Expected: sukses.

- [ ] **Step 4: Commit**

```bash
git add src/lib/utils.ts src/lib/tokens.ts
git commit -m "feat(lib): add cn, formatRupiah, token utilities"
```

---

## Task 7: NotificationSender interface + implementasi Tahap 0

**Files:**
- Create: `src/features/notifications/types.ts`
- Create: `src/features/notifications/wa-link.ts`
- Create: `src/features/notifications/email.ts`

**Interfaces:**
- Produces:
  - `interface NotificationSender` dengan method `compose()` dan `channel()`
  - `WaLinkSender` — implementasi Tahap 0 (wa.me deep link)
  - `EmailSender` — via Resend

- [ ] **Step 1: Buat src/features/notifications/types.ts**

```typescript
import type { NotificationKind, NotificationChannel } from "@/types";

export interface ComposedMessage {
	url_atau_payload: string;
	preview: string;
}

export interface NotificationSender {
	compose(invoice: InvoiceForNotification, jenis: NotificationKind): ComposedMessage;
	channel(): NotificationChannel;
}

export interface InvoiceForNotification {
	id: string;
	roomLabel: string;
	period: string;
	totalAmount: number;
	dueDate: string;
	ownerPhone: string;
	tenantPhone: string;
	bankAccountNumber: string;
	bankCode: string;
	bankHolder: string;
	uploadToken: string;
	propertyName: string;
}
```

- [ ] **Step 2: Buat src/features/notifications/wa-link.ts**

```typescript
import type { NotificationSender, ComposedMessage, InvoiceForNotification } from "./types";
import type { NotificationKind, NotificationChannel } from "@/types";
import { formatRupiah } from "@/lib/utils";

export class WaLinkSender implements NotificationSender {
	channel(): NotificationChannel {
		return "wa_link";
	}

	compose(invoice: InvoiceForNotification, jenis: NotificationKind): ComposedMessage {
		const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/bukti/${invoice.uploadToken}`;
		const sapaan = this.getSapaan(jenis);
		const rekening = `${invoice.bankCode} ${invoice.bankAccountNumber} a.n. ${invoice.bankHolder}`;

		const teks = [
			`${sapaan}`,
			``,
			`Tagihan sewa *${invoice.propertyName}* — ${invoice.roomLabel}`,
			`Periode: *${invoice.period}*`,
			`Jumlah: *${formatRupiah(invoice.totalAmount)}*`,
			`Jatuh tempo: *${invoice.dueDate}*`,
			``,
			`Transfer ke:`,
			`${rekening}`,
			``,
			`Setelah transfer, upload buktinya di:`,
			uploadUrl
		].join("\n");

		const encodedTeks = encodeURIComponent(teks);
		const url = `https://wa.me/${invoice.tenantPhone}?text=${encodedTeks}`;

		return { url_atau_payload: url, preview: teks };
	}

	private getSapaan(jenis: NotificationKind): string {
		const sapaan: Record<NotificationKind, string> = {
			tagihan: "Halo! Ini tagihan sewa bulan ini.",
			h_minus_3: "Pengingat: tagihan sewa jatuh tempo 3 hari lagi.",
			hari_h: "Pengingat: tagihan sewa jatuh tempo hari ini.",
			h_plus_3: "Tagihan sewa sudah lewat jatuh tempo. Mohon segera dibayar.",
			h_plus_7: "Tagihan sewa sudah 7 hari lewat jatuh tempo. Harap segera dilunasi."
		};
		return sapaan[jenis];
	}
}
```

- [ ] **Step 3: Buat src/features/notifications/email.ts**

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
	to,
	subject,
	html
}: {
	to: string;
	subject: string;
	html: string;
}) {
	return resend.emails.send({
		from: process.env.RESEND_FROM_EMAIL ?? "notif@semang.id",
		to,
		subject,
		html
	});
}
```

- [ ] **Step 4: Verifikasi TypeScript**

```bash
bun run build
```

Expected: sukses.

- [ ] **Step 5: Commit**

```bash
git add src/features/notifications/
git commit -m "feat(notifications): add NotificationSender interface, WaLinkSender, EmailSender"
```

---

## Task 8: Folder structure + stub files

**Files:**
- Create: semua `src/features/*/actions.ts`, `src/features/*/schemas.ts`
- Create: semua `src/app/**/page.tsx` stub
- Create: semua `src/app/api/**/route.ts` stub
- Create: `src/hooks/` directory
- Create: `src/components/shared/` directory

**Interfaces:**
- Produces: semua module bisa di-import, `bun run build` sukses tanpa 404 route errors

- [ ] **Step 1: Buat feature stubs — auth**

```typescript
// src/features/auth/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
	identifier: z.string().min(1, "Email atau nomor WA wajib diisi"),
	password: z.string().min(8, "Password minimal 8 karakter")
});

export const registerSchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter"),
	email: z.string().email("Format email tidak valid"),
	phone_wa: z
		.string()
		.regex(/^\+62\d{9,13}$/, "Format nomor WA: +62xxxxxxxxx"),
	password: z.string().min(8, "Password minimal 8 karakter")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

```typescript
// src/features/auth/actions.ts
"use server";

export async function login(_prevState: unknown, formData: FormData) {
	// TODO: implementasi di task auth
	return { error: "Belum diimplementasikan" };
}

export async function register(_prevState: unknown, formData: FormData) {
	// TODO: implementasi di task auth
	return { error: "Belum diimplementasikan" };
}
```

- [ ] **Step 2: Buat feature stubs — properties**

```typescript
// src/features/properties/schemas.ts
import { z } from "zod";

export const createPropertySchema = z.object({
	name: z.string().min(2, "Nama kost minimal 2 karakter"),
	city: z.string().min(2, "Kota minimal 2 karakter"),
	room_count: z.number().int().min(1).max(50),
	default_rent: z.number().int().positive("Harga sewa harus lebih dari 0"),
	default_due_day: z.number().int().min(1).max(28)
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
```

```typescript
// src/features/properties/actions.ts
"use server";

export async function createProperty(_input: unknown) {
	// TODO: implementasi di task properties
}
```

- [ ] **Step 3: Buat feature stubs — invoices**

```typescript
// src/features/invoices/schemas.ts
import { z } from "zod";

export const createAdHocInvoiceSchema = z.object({
	room_id: z.string().uuid(),
	tenant_id: z.string().uuid(),
	amount: z.number().int().positive(),
	description: z.string().min(1),
	due_date: z.string().date()
});

export type CreateAdHocInvoiceInput = z.infer<typeof createAdHocInvoiceSchema>;
```

```typescript
// src/features/invoices/actions.ts
"use server";

export async function createAdHocInvoice(_input: unknown) {
	// TODO: implementasi di task invoices
}
```

```typescript
// src/features/invoices/state-machine.ts
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
```

- [ ] **Step 4: Buat feature stubs — proofs**

```typescript
// src/features/proofs/actions.ts
"use server";

export async function decideProof(
	_proofId: string,
	_decision: "diterima" | "ditolak",
	_reason?: string
) {
	// TODO: implementasi di task proofs
}
```

- [ ] **Step 5: Buat feature stubs — reports**

```typescript
// src/features/reports/actions.ts
"use server";

export async function exportReport(_from: string, _to: string, _format: "csv" | "excel") {
	// TODO: implementasi di task reports
}
```

- [ ] **Step 6: Buat page stubs — auth**

```tsx
// src/app/(auth)/masuk/page.tsx
export default function MasukPage() {
	return <div>Halaman Masuk — segera hadir</div>;
}
```

```tsx
// src/app/(auth)/daftar/page.tsx
export default function DaftarPage() {
	return <div>Halaman Daftar — segera hadir</div>;
}
```

- [ ] **Step 7: Buat layout + page stubs — dashboard**

```tsx
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
```

```tsx
// src/app/(dashboard)/page.tsx
export default function DashboardPage() {
	return <div>Dashboard — segera hadir</div>;
}
```

```tsx
// src/app/(dashboard)/antrean/page.tsx
export default function AntreanPage() {
	return <div>Antrean Siap Kirim — segera hadir</div>;
}
```

```tsx
// src/app/(dashboard)/tagihan/page.tsx
export default function TagihanPage() {
	return <div>Daftar Tagihan — segera hadir</div>;
}
```

```tsx
// src/app/(dashboard)/kamar/page.tsx
export default function KamarPage() {
	return <div>Manajemen Kamar — segera hadir</div>;
}
```

```tsx
// src/app/(dashboard)/pengaturan/page.tsx
export default function PengaturanPage() {
	return <div>Pengaturan — segera hadir</div>;
}
```

- [ ] **Step 8: Buat page stubs — public (penghuni)**

```tsx
// src/app/p/isi/[token]/page.tsx
export default function IsiMandiriPage({ params }: { params: Promise<{ token: string }> }) {
	void params;
	return <div>Form Isi Data Penghuni — segera hadir</div>;
}
```

```tsx
// src/app/p/bukti/[token]/page.tsx
export default function UploadBuktiPage({ params }: { params: Promise<{ token: string }> }) {
	void params;
	return <div>Upload Bukti Transfer — segera hadir</div>;
}
```

```tsx
// src/app/p/kuitansi/[token]/page.tsx
export default function KuitansiPage({ params }: { params: Promise<{ token: string }> }) {
	void params;
	return <div>Kuitansi Digital — segera hadir</div>;
}
```

- [ ] **Step 9: Buat root page — redirect logic stub**

```tsx
// src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
	// Middleware handle auth redirect; ini fallback
	redirect("/antrean");
}
```

- [ ] **Step 10: Buat route handler stubs — properties + rooms**

```typescript
// src/app/api/properties/route.ts
import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

```typescript
// src/app/api/rooms/[id]/route.ts
import { NextResponse } from "next/server";

export async function PATCH() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

```typescript
// src/app/api/rooms/[id]/self-fill-token/route.ts
import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

- [ ] **Step 11: Buat route handler stubs — tenants**

```typescript
// src/app/api/tenants/[id]/checkout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

- [ ] **Step 12: Buat route handler stubs — queue**

```typescript
// src/app/api/queue/route.ts
import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

```typescript
// src/app/api/queue/[id]/opened/route.ts
import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

- [ ] **Step 13: Buat route handler stubs — proofs + reports**

```typescript
// src/app/api/proofs/[id]/decide/route.ts
import { NextResponse } from "next/server";

export async function POST() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

```typescript
// src/app/api/reports/export/route.ts
import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({ error: "Belum diimplementasikan" }, { status: 501 });
}
```

- [ ] **Step 14: Buat route handler stubs — cron**

Semua cron endpoint verifikasi `CRON_SECRET` di header:

```typescript
// src/app/api/cron/generate-invoices/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ ok: true, message: "Belum diimplementasikan" });
}
```

```typescript
// src/app/api/cron/run-timeouts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ ok: true, message: "Belum diimplementasikan" });
}
```

```typescript
// src/app/api/cron/monthly-summary/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ ok: true, message: "Belum diimplementasikan" });
}
```

```typescript
// src/app/api/cron/cleanup-tokens/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({ ok: true, message: "Belum diimplementasikan" });
}
```

- [ ] **Step 15: Buat direktori hooks dan components/shared**

```bash
mkdir -p src/hooks src/components/shared
touch src/hooks/.gitkeep src/components/shared/.gitkeep
```

- [ ] **Step 16: Verifikasi full build**

```bash
bun run build
```

Expected: semua routes terdaftar di Route table, tidak ada TypeScript error.

- [ ] **Step 17: Commit**

```bash
git add src/
git commit -m "feat: add all page, route, and feature stubs"
```

---

## Task 9: Supabase migration — init schema (18 tabel)

**Files:**
- Create: `supabase/migrations/20260628000001_init_schema.sql`

**Interfaces:**
- Produces: semua 18 tabel siap di-apply ke Supabase project

- [ ] **Step 1: Init Supabase lokal**

```bash
bunx supabase init
```

Expected: folder `supabase/` dengan `config.toml`.

- [ ] **Step 2: Buat file migration**

Buat `supabase/migrations/20260628000001_init_schema.sql` dengan konten berikut:

```sql
-- Extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- IDENTITAS & AKSES
-- ============================================================

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  name varchar not null,
  email varchar not null unique,
  phone_wa varchar not null unique,
  email_verified_at timestamp with time zone,
  phone_verified_at timestamp with time zone,
  locale varchar not null default 'id',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone
);

create table bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  bank_code varchar not null,
  account_number varchar not null,
  account_holder varchar not null,
  is_default boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone
);

-- ============================================================
-- MONETISASI (sebelum properties karena subscriptions reference plans)
-- ============================================================

create table plans (
  id uuid primary key default uuid_generate_v4(),
  code varchar not null unique,
  name varchar not null,
  price_per_room bigint not null default 0,
  min_monthly bigint not null default 0,
  max_rooms integer not null default 50,
  max_properties integer not null default 1,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table plan_features (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references plans(id) on delete cascade,
  feature_key varchar not null,
  enabled boolean not null default true,
  limit_value integer,
  created_at timestamp with time zone not null default now()
);

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references users(id) on delete cascade,
  plan_id uuid not null references plans(id),
  status varchar not null default 'active',
  billing_cycle varchar not null default 'monthly',
  trial_invoices_left smallint,
  current_period_start date,
  current_period_end date,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table subscription_addons (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid not null references subscriptions(id) on delete cascade,
  feature_key varchar not null,
  price_monthly bigint not null,
  status varchar not null default 'active',
  activated_at timestamp with time zone,
  deactivated_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

-- ============================================================
-- PROPERTI & PENGHUNI
-- ============================================================

create table properties (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references users(id) on delete cascade,
  name varchar not null,
  city varchar not null,
  default_rent bigint not null,
  default_due_day smallint not null check (default_due_day between 1 and 28),
  timezone varchar not null default 'Asia/Jakarta',
  unique_code_enabled boolean not null default false,
  status varchar not null default 'active',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone
);

create table property_staff (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role varchar not null,
  invited_at timestamp with time zone,
  accepted_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  revoked_at timestamp with time zone
);

create table rooms (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties(id) on delete cascade,
  room_number integer not null check (room_number between 1 and 999),
  label varchar,
  rent_override bigint,
  due_day_override smallint check (due_day_override between 1 and 28),
  status varchar not null default 'vacant',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  unique (property_id, room_number)
);

create table tenants (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete cascade,
  user_id uuid references users(id),
  name varchar not null,
  phone_wa varchar not null,
  moved_in_at date not null,
  moved_out_at date,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- ============================================================
-- TAGIHAN & PEMBAYARAN
-- ============================================================

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id),
  tenant_id uuid not null references tenants(id),
  period char(7) not null,
  base_amount bigint not null,
  unique_code smallint,
  total_amount bigint not null,
  currency char(3) not null default 'IDR',
  status varchar not null default 'draft',
  due_date date not null,
  idempotency_key varchar not null unique,
  sent_at timestamp with time zone,
  paid_at timestamp with time zone,
  overdue_at timestamp with time zone,
  defaulted_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (room_id, period)
);

create table invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  kind varchar not null,
  description varchar not null,
  amount bigint not null,
  metadata jsonb,
  created_at timestamp with time zone not null default now()
);

create table proofs (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  storage_key varchar not null,
  mime_type varchar not null,
  file_size bigint,
  status varchar not null default 'pending',
  rejection_reason text,
  decided_by uuid references users(id),
  decided_at timestamp with time zone,
  uploaded_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

create table payments (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id),
  proof_id uuid references proofs(id),
  source varchar not null,
  amount bigint not null,
  status varchar not null default 'pending',
  provider varchar,
  provider_ref varchar unique,
  provider_fee bigint,
  provider_payload jsonb,
  idempotency_key varchar not null unique,
  confirmed_by uuid references users(id),
  paid_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table invoice_events (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  actor_id uuid references users(id),
  event_type varchar not null,
  from_status varchar,
  to_status varchar,
  metadata jsonb,
  created_at timestamp with time zone not null default now()
);

-- ============================================================
-- KOMUNIKASI & AKSES PUBLIK
-- ============================================================

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  recipient_phone varchar not null,
  kind varchar not null,
  channel varchar not null,
  payload text not null,
  status varchar not null default 'pending',
  provider_ref varchar,
  opened_at timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create table public_tokens (
  id uuid primary key default uuid_generate_v4(),
  kind varchar not null,
  target_id uuid not null,
  token_hash varchar not null unique,
  expires_at timestamp with time zone not null,
  used_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

-- ============================================================
-- INTEGRASI MASA DEPAN
-- ============================================================

create table webhook_logs (
  id uuid primary key default uuid_generate_v4(),
  source varchar not null,
  event_type varchar not null,
  idempotency_key varchar not null unique,
  payload jsonb not null,
  processed boolean not null default false,
  attempt_count integer not null default 0,
  last_error text,
  processed_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_bank_accounts_user_id on bank_accounts(user_id);
create index idx_properties_owner_id on properties(owner_id);
create index idx_subscriptions_owner_id on subscriptions(owner_id);
create index idx_rooms_property_id on rooms(property_id);
create index idx_tenants_room_id on tenants(room_id);
create index idx_invoices_room_id on invoices(room_id);
create index idx_invoices_tenant_id on invoices(tenant_id);
create index idx_invoices_status on invoices(status);
create index idx_invoices_due_date on invoices(due_date);
create index idx_invoice_items_invoice_id on invoice_items(invoice_id);
create index idx_proofs_invoice_id on proofs(invoice_id);
create index idx_payments_invoice_id on payments(invoice_id);
create index idx_invoice_events_invoice_id on invoice_events(invoice_id);
create index idx_notifications_invoice_id on notifications(invoice_id);
create index idx_notifications_status on notifications(status);
create index idx_public_tokens_expires_at on public_tokens(expires_at);
create index idx_plan_features_plan_id on plan_features(plan_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at
  before update on users for each row execute function update_updated_at();
create trigger trg_bank_accounts_updated_at
  before update on bank_accounts for each row execute function update_updated_at();
create trigger trg_properties_updated_at
  before update on properties for each row execute function update_updated_at();
create trigger trg_rooms_updated_at
  before update on rooms for each row execute function update_updated_at();
create trigger trg_tenants_updated_at
  before update on tenants for each row execute function update_updated_at();
create trigger trg_invoices_updated_at
  before update on invoices for each row execute function update_updated_at();
create trigger trg_payments_updated_at
  before update on payments for each row execute function update_updated_at();
create trigger trg_plans_updated_at
  before update on plans for each row execute function update_updated_at();
create trigger trg_subscriptions_updated_at
  before update on subscriptions for each row execute function update_updated_at();
```

- [ ] **Step 3: Verifikasi SQL syntax (dry-run)**

```bash
bunx supabase db lint supabase/migrations/20260628000001_init_schema.sql 2>/dev/null || echo "lint unavailable — review SQL manually"
```

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat(db): add init schema migration — 18 tables"
```

---

## Task 10: Supabase migration — RLS policies + seed

**Files:**
- Create: `supabase/migrations/20260628000002_rls_policies.sql`
- Create: `supabase/seed.sql`

**Interfaces:**
- Produces: RLS aktif di semua tabel, data plans tier ter-seed

- [ ] **Step 1: Buat file RLS**

Buat `supabase/migrations/20260628000002_rls_policies.sql`:

```sql
-- Enable RLS semua tabel
alter table users enable row level security;
alter table bank_accounts enable row level security;
alter table properties enable row level security;
alter table property_staff enable row level security;
alter table subscriptions enable row level security;
alter table subscription_addons enable row level security;
alter table plans enable row level security;
alter table plan_features enable row level security;
alter table rooms enable row level security;
alter table tenants enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table proofs enable row level security;
alter table payments enable row level security;
alter table invoice_events enable row level security;
alter table notifications enable row level security;
alter table public_tokens enable row level security;
alter table webhook_logs enable row level security;

-- ============================================================
-- LEVEL 1: DIRECT OWNERSHIP
-- ============================================================

create policy "users: own row only"
  on users for all using (id = auth.uid());

create policy "bank_accounts: owner only"
  on bank_accounts for all using (user_id = auth.uid());

create policy "properties: owner only"
  on properties for all using (owner_id = auth.uid());

create policy "subscriptions: owner only"
  on subscriptions for all using (owner_id = auth.uid());

create policy "subscription_addons: via subscription"
  on subscription_addons for all using (
    exists (
      select 1 from subscriptions
      where subscriptions.id = subscription_addons.subscription_id
        and subscriptions.owner_id = auth.uid()
    )
  );

-- Plans & features: semua bisa baca (publik untuk onboarding)
create policy "plans: public read"
  on plans for select using (true);

create policy "plan_features: public read"
  on plan_features for select using (true);

-- ============================================================
-- LEVEL 2: VIA PROPERTIES JOIN
-- ============================================================

create policy "property_staff: property owner"
  on property_staff for all using (
    exists (
      select 1 from properties
      where properties.id = property_staff.property_id
        and properties.owner_id = auth.uid()
    )
  );

create policy "rooms: via property owner"
  on rooms for all using (
    exists (
      select 1 from properties
      where properties.id = rooms.property_id
        and properties.owner_id = auth.uid()
    )
  );

-- ============================================================
-- LEVEL 3: VIA ROOMS → PROPERTIES JOIN
-- ============================================================

create policy "tenants: via property owner"
  on tenants for all using (
    exists (
      select 1 from rooms
      join properties on properties.id = rooms.property_id
      where rooms.id = tenants.room_id
        and properties.owner_id = auth.uid()
    )
  );

create policy "invoices: via property owner"
  on invoices for all using (
    exists (
      select 1 from rooms
      join properties on properties.id = rooms.property_id
      where rooms.id = invoices.room_id
        and properties.owner_id = auth.uid()
    )
  );

-- ============================================================
-- LEVEL 4: VIA INVOICES → ROOMS → PROPERTIES JOIN
-- ============================================================

create policy "invoice_items: via property owner"
  on invoice_items for all using (
    exists (
      select 1 from invoices
      join rooms on rooms.id = invoices.room_id
      join properties on properties.id = rooms.property_id
      where invoices.id = invoice_items.invoice_id
        and properties.owner_id = auth.uid()
    )
  );

create policy "proofs: via property owner"
  on proofs for all using (
    exists (
      select 1 from invoices
      join rooms on rooms.id = invoices.room_id
      join properties on properties.id = rooms.property_id
      where invoices.id = proofs.invoice_id
        and properties.owner_id = auth.uid()
    )
  );

create policy "payments: via property owner"
  on payments for all using (
    exists (
      select 1 from invoices
      join rooms on rooms.id = invoices.room_id
      join properties on properties.id = rooms.property_id
      where invoices.id = payments.invoice_id
        and properties.owner_id = auth.uid()
    )
  );

create policy "invoice_events: via property owner"
  on invoice_events for all using (
    exists (
      select 1 from invoices
      join rooms on rooms.id = invoices.room_id
      join properties on properties.id = rooms.property_id
      where invoices.id = invoice_events.invoice_id
        and properties.owner_id = auth.uid()
    )
  );

create policy "notifications: via property owner"
  on notifications for all using (
    exists (
      select 1 from invoices
      join rooms on rooms.id = invoices.room_id
      join properties on properties.id = rooms.property_id
      where invoices.id = notifications.invoice_id
        and properties.owner_id = auth.uid()
    )
  );

-- ============================================================
-- NO DIRECT ACCESS — hanya via service role (RPC)
-- ============================================================

-- public_tokens diakses halaman publik via Postgres RPC function dengan service role
create policy "public_tokens: no direct client access"
  on public_tokens for all using (false);

-- webhook_logs hanya diakses service role (cron endpoint)
create policy "webhook_logs: no direct client access"
  on webhook_logs for all using (false);
```

- [ ] **Step 2: Buat supabase/seed.sql**

```sql
-- Seed: 4 tier plan (ENT-02: semua flag aktif di Tahap 0)
insert into plans (code, name, price_per_room, min_monthly, max_rooms, max_properties, is_active)
values
  ('gratis',  'Gratis',  0,     0,      50,  1,   true),
  ('starter', 'Starter', 15000, 50000,  50,  3,   true),
  ('pro',     'Pro',     12000, 100000, 100, 10,  true),
  ('bisnis',  'Bisnis',  10000, 200000, 999, 999, true)
on conflict (code) do nothing;

-- Aktifkan semua fitur untuk tier gratis (Tahap 0)
insert into plan_features (plan_id, feature_key, enabled)
select
  p.id,
  f.feature_key,
  true
from plans p
cross join (
  values
    ('tagihan_otomatis'),
    ('notifikasi_wa_link'),
    ('notifikasi_email'),
    ('upload_bukti'),
    ('kuitansi_digital'),
    ('ekspor_csv'),
    ('laporan_bulanan'),
    ('kode_unik_nominal'),
    ('onboarding_wizard')
) as f(feature_key)
where p.code = 'gratis'
on conflict do nothing;
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260628000002_rls_policies.sql supabase/seed.sql
git commit -m "feat(db): add rls policies and seed data"
```

---

## Task 11: vercel.json + final verification

**Files:**
- Create: `vercel.json`
- Modify: `next.config.ts` (tambah headers untuk cron)

**Interfaces:**
- Produces: deployment-ready config, `bun run build` bersih

- [ ] **Step 1: Buat vercel.json**

WIB (UTC+7) → UTC conversion: 02:00 WIB = 19:00 UTC, 03:00 WIB = 20:00 UTC, 06:00 WIB = 23:00 UTC.

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-invoices",
      "schedule": "0 19 * * *"
    },
    {
      "path": "/api/cron/run-timeouts",
      "schedule": "0 20 * * *"
    },
    {
      "path": "/api/cron/monthly-summary",
      "schedule": "0 23 1 * *"
    },
    {
      "path": "/api/cron/cleanup-tokens",
      "schedule": "0 17 * * 0"
    }
  ]
}
```

- [ ] **Step 2: Final full build check**

```bash
bun run build
```

Expected output harus menampilkan semua routes:
```
Route (app)                            Size
┌ ○ /                                 ...
├ ○ /(auth)/masuk                     ...
├ ○ /(auth)/daftar                    ...
├ ○ /(dashboard)                      ...
├ ○ /(dashboard)/antrean              ...
├ ○ /(dashboard)/tagihan              ...
├ ○ /(dashboard)/kamar                ...
├ ○ /(dashboard)/pengaturan           ...
├ ƒ /p/isi/[token]                    ...
├ ƒ /p/bukti/[token]                  ...
├ ƒ /p/kuitansi/[token]               ...
└── /api/... (semua route handlers)
```

Tidak boleh ada TypeScript error atau "missing module".

- [ ] **Step 3: Pastikan lint bersih**

```bash
bun run lint
```

Expected: "No ESLint warnings or errors" atau hanya warnings non-breaking.

- [ ] **Step 4: Format semua file**

```bash
bun run format
```

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "chore: add vercel.json cron config and final cleanup"
```

---

## Self-Review Checklist

- [x] AUTH-01/02: `registerSchema` + `loginSchema` ada di `src/features/auth/schemas.ts`
- [x] KOST-01/02: `createPropertySchema` ada, generate kamar akan di task properti
- [x] PHN-01: route `/p/isi/[token]` ada sebagai stub
- [x] TGH-03: `state-machine.ts` dengan `isValidTransition()` dan `VALID_TRANSITIONS` array
- [x] TGH-05: `unique (room_id, period)` di migration
- [x] NTF-04: `NotificationSender` interface di `features/notifications/types.ts`
- [x] BKT-01: route `/p/bukti/[token]` ada
- [x] NFR-02: RLS enabled semua tabel di migration 2
- [x] NFR-03: token 32 byte di `lib/tokens.ts`, disimpan sebagai SHA-256 hash
- [x] ENT-01/02: tabel `plans`, `plan_features`, `subscriptions` ada + seed data
- [x] TRD §9: CRON_SECRET check di semua cron endpoints
- [x] TRD §8: `vercel.json` cron schedule 4 jobs dengan UTC yang tepat
