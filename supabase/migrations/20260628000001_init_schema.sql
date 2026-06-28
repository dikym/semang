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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  feature_key varchar not null,
  enabled boolean not null default true,
  limit_value integer,
  created_at timestamp with time zone not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role varchar not null,
  invited_at timestamp with time zone,
  accepted_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  revoked_at timestamp with time zone
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  kind varchar not null,
  description varchar not null,
  amount bigint not null,
  metadata jsonb,
  created_at timestamp with time zone not null default now()
);

create table proofs (
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
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
  new.updated_at = pg_catalog.now();
  return new;
end;
$$ language plpgsql
set search_path = '';

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
