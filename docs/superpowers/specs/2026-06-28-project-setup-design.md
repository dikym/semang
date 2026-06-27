# Semang — Project Setup Design Spec

**Tanggal:** 2026-06-28  
**Status:** Approved  
**Acuan:** Semang TRD v1.0, SRD v1.0

---

## 1. Tech Stack

| Layer                     | Pilihan                       | Versi                              |
|---------------------------|-------------------------------|------------------------------------|
| Framework                 | Next.js (App Router)          | ^15                                |
| Bahasa                    | TypeScript                    | ^5                                 |
| Package Manager           | bun                           | latest                             |
| Database + Auth + Storage | Supabase                      | supabase-js ^2, @supabase/ssr ^0.6 |
| Styling                   | Tailwind CSS                  | ^4                                 |
| Komponen UI               | shadcn/ui                     | latest (Tailwind v4 compatible)    |
| Validasi                  | Zod                           | ^3                                 |
| Email                     | Resend                        | ^4                                 |
| Kompresi Gambar           | browser-image-compression     | ^2                                 |
| Linting                   | ESLint 9 + eslint-config-next | ^15                                |
| Formatting                | Prettier                      | ^3                                 |
| Supabase CLI              | supabase (devDep)             | ^2                                 |

---

## 2. Pendekatan Setup

**`create-next-app` + manual additions.**  
Scaffold dengan Next.js CLI (TypeScript, ESLint, Tailwind, `src/`, App Router, no Turbopack in prod), lalu tambahkan Supabase, shadcn, Zod, Resend secara manual. Tidak pakai Supabase starter template — terlalu banyak boilerplate yang bertentangan dengan desain AUTH custom (login via WA number lookup).

---

## 3. Struktur Folder

```
semang/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── masuk/page.tsx
│   │   │   └── daftar/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── antrean/page.tsx
│   │   │   ├── tagihan/page.tsx
│   │   │   ├── kamar/page.tsx
│   │   │   └── pengaturan/page.tsx
│   │   ├── p/
│   │   │   ├── isi/[token]/page.tsx
│   │   │   ├── bukti/[token]/page.tsx
│   │   │   └── kuitansi/[token]/page.tsx
│   │   ├── api/
│   │   │   ├── properties/route.ts
│   │   │   ├── rooms/[id]/route.ts
│   │   │   ├── rooms/[id]/self-fill-token/route.ts
│   │   │   ├── tenants/[id]/checkout/route.ts
│   │   │   ├── queue/route.ts
│   │   │   ├── queue/[id]/opened/route.ts
│   │   │   ├── proofs/[id]/decide/route.ts
│   │   │   ├── reports/export/route.ts
│   │   │   └── cron/
│   │   │       ├── generate-invoices/route.ts
│   │   │       ├── run-timeouts/route.ts
│   │   │       ├── monthly-summary/route.ts
│   │   │       └── cleanup-tokens/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── actions.ts
│   │   │   ├── schemas.ts
│   │   │   └── components/
│   │   ├── properties/
│   │   │   ├── actions.ts
│   │   │   ├── schemas.ts
│   │   │   └── components/
│   │   ├── invoices/
│   │   │   ├── actions.ts
│   │   │   ├── schemas.ts
│   │   │   ├── state-machine.ts
│   │   │   └── components/
│   │   ├── notifications/
│   │   │   ├── types.ts
│   │   │   ├── wa-link.ts
│   │   │   └── email.ts
│   │   ├── proofs/
│   │   │   ├── actions.ts
│   │   │   └── components/
│   │   └── reports/
│   │       └── actions.ts
│   │
│   ├── components/
│   │   ├── ui/               # shadcn (auto-generated)
│   │   └── shared/           # komponen reusable lintas fitur
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts     # createBrowserClient
│   │   │   ├── server.ts     # createServerClient
│   │   │   └── middleware.ts
│   │   ├── tokens.ts         # generate + verify public tokens (≥128 bit, SHA-256 stored)
│   │   └── utils.ts          # cn(), formatRupiah()
│   │
│   ├── hooks/
│   ├── types/
│   │   ├── database.ts       # generated dari Supabase CLI
│   │   └── index.ts
│   │
│   └── middleware.ts         # auth guard + rate limit (edge runtime)
│
├── supabase/
│   ├── migrations/
│   │   ├── 20260628000001_init_schema.sql
│   │   └── 20260628000002_rls_policies.sql
│   └── seed.sql
│
├── public/
├── vercel.json
└── .env.example
```

**Prinsip:**
- Route handlers di `app/api/` tipis — parse + delegate ke `features/`
- `features/` = domain logic co-located per area bisnis
- `lib/` = pure utilities tanpa domain knowledge
- `components/ui/` = shadcn; `components/shared/` = app-level reusables

---

## 4. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only, tidak pernah ke client bundle

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=notif@semang.id

# Cron security (TRD §9)
CRON_SECRET=                      # random 32+ char

# App
NEXT_PUBLIC_APP_URL=https://semang.id
```

---

## 5. Supabase Schema (18 Tabel)

### Migration 1 — `init_schema.sql`

Semua tabel, indexes, unique constraints, dan foreign keys:

**Identitas & Akses:**
- `users` — id (=auth.uid), name, email UK, phone_wa UK, locale
- `bank_accounts` — id, user_id, bank_code, account_number, account_holder, is_default
- `property_staff` — id, property_id, user_id, role, invited_at, accepted_at, revoked_at

**Properti & Penghuni:**
- `properties` — id, owner_id, name, city, default_rent, default_due_day, timezone, unique_code_enabled, status, deleted_at
- `rooms` — id, property_id, room_number (int 1–50), label, rent_override, due_day_override, status
- `tenants` — id, room_id, user_id (nullable), name, phone_wa, moved_in_at, moved_out_at

**Tagihan & Pembayaran:**
- `invoices` — id, room_id, tenant_id, period (char 7 "YYYY-MM"), base_amount, unique_code (smallint nullable), total_amount, status, due_date, idempotency_key UK; UNIQUE(room_id, period)
- `invoice_items` — id, invoice_id, kind, description, amount, metadata jsonb
- `proofs` — id, invoice_id, storage_key, mime_type, file_size, status, rejection_reason, decided_by, decided_at
- `payments` — id, invoice_id, proof_id, source, amount, status, provider, provider_payload jsonb, idempotency_key UK, confirmed_by
- `invoice_events` — id, invoice_id, actor_id, event_type, from_status, to_status, metadata jsonb, created_at

**Komunikasi & Akses Publik:**
- `notifications` — id, invoice_id, recipient_phone, kind, channel, payload, status, provider_ref, opened_at, sent_at
- `public_tokens` — id, kind, target_id, token_hash UK, expires_at, used_at

**Monetisasi:**
- `plans` — id, code UK (gratis/starter/pro/bisnis), price_per_room, min_monthly, max_rooms, max_properties, is_active
- `plan_features` — id, plan_id, feature_key, enabled, limit_value
- `subscriptions` — id, owner_id, plan_id, status, billing_cycle, trial_invoices_left, current_period_start, current_period_end
- `subscription_addons` — id, subscription_id, feature_key, price_monthly, status

**Integrasi:**
- `webhook_logs` — id, source, event_type, idempotency_key UK, payload jsonb, processed, attempt_count, last_error

### Migration 2 — `rls_policies.sql`

Pattern kepemilikan:
- Direct: `users`, `bank_accounts`, `properties`, `subscriptions` — `owner_id = auth.uid()`
- Via join: `rooms`, `invoices`, `payments`, dll — join ke `properties` untuk verifikasi `owner_id`
- Publik via RPC: `public_tokens`, halaman isi-mandiri/upload/kuitansi — diakses melalui fungsi Postgres ter-batasi yang verify token hash, bypass RLS terkontrol

### seed.sql

Data awal 4 tier plan (gratis/starter/pro/bisnis) + feature flags semua aktif untuk tier gratis (ENT-02).

---

## 6. Vercel Cron Config

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/generate-invoices", "schedule": "0 19 * * *" },
    { "path": "/api/cron/run-timeouts",      "schedule": "0 20 * * *" },
    { "path": "/api/cron/monthly-summary",   "schedule": "0 23 1 * *" },
    { "path": "/api/cron/cleanup-tokens",    "schedule": "0 0 * * 0"  }
  ]
}
```

*(02.00, 03.00, 06.00, mingguan WIB = UTC-7 → UTC+7, jadi UTC 19, 20, 23, 00)*

---

## 7. Prettier Config (Update dari Svelte → Next.js)

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

Plugin Svelte dihapus karena tidak dipakai.

---

## 8. Scope yang Dikecualikan dari Setup Ini

Tidak ada kode bisnis, tidak ada implementasi fitur. Setup ini hanya:
- Scaffold project
- Install dan konfigurasi dependencies
- Stub file (placeholder export) untuk setiap route dan feature module
- SQL migration lengkap
- `.env.example` dan `vercel.json`
