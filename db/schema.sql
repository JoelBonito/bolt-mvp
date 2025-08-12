create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  patient_name text,
  before_url text,
  after_url text,
  created_at timestamp with time zone default now()
);
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid references simulations(id) on delete set null,
  teeth_count int,
  unit_price numeric,
  clinic_fee numeric,
  discount numeric,
  subtotal numeric,
  total numeric,
  pdf_url text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid references simulations(id) on delete set null,
  pdf_url text,
  created_at timestamp with time zone default now()
);
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid references simulations(id) on delete set null,
  starts_at timestamp with time zone,
  duration_min int,
  ics_url text,
  created_at timestamp with time zone default now()
);
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id) on delete set null,
  provider text default 'stripe',
  client_secret text,
  status text default 'requires_payment_method',
  amount numeric,
  currency text default 'BRL',
  created_at timestamp with time zone default now()
);
