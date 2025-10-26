-- Idempotent schema creation for Supabase (PostgreSQL)
-- This script mirrors shared/schema.ts and can be re-run safely.
-- Execute in Supabase SQL editor. Make sure to run in the correct database.

-- 1) Extensions required
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- 2) Enums
do $$ begin
  create type user_role as enum ('customer','partner','driver','personnel','admin','guest');
exception when duplicate_object then null; end $$;

do $$ begin
  create type parcel_status as enum ('pending','picked_up','in_transit','at_hub','out_for_delivery','delivered','failed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending','processing','shipped','delivered','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_type as enum ('deposit','withdrawal','payment','refund','commission');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('wallet','cash_on_delivery','telebirr','chapa','arifpay');
exception when duplicate_object then null; end $$;

do $$ begin
  create type language as enum ('en','am');
exception when duplicate_object then null; end $$;

-- 3) Tables
-- users
create table if not exists users (
  id varchar primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  name text not null,
  phone text,
  role user_role not null default 'customer',
  language language not null default 'en',
  wallet_balance numeric(10,2) not null default 0.00,
  avatar text,
  is_verified boolean not null default false,
  created_at timestamp not null default now()
);

-- partners
create table if not exists partners (
  id varchar primary key default gen_random_uuid(),
  user_id varchar not null,
  business_name text not null,
  category text not null,
  description text,
  address text not null,
  latitude numeric(10,7) not null,
  longitude numeric(10,7) not null,
  phone text not null,
  is_verified boolean not null default false,
  balance numeric(10,2) not null default 0.00,
  rating numeric(3,2) default 0.00,
  total_ratings integer not null default 0,
  banner text,
  created_at timestamp not null default now(),
  constraint partners_user_fk foreign key (user_id) references users(id)
);

-- shops
create table if not exists shops (
  id varchar primary key default gen_random_uuid(),
  partner_id varchar not null,
  name text not null,
  description text,
  banner text,
  is_active boolean not null default true,
  created_at timestamp not null default now(),
  constraint shops_partner_fk foreign key (partner_id) references partners(id)
);

-- items
create table if not exists items (
  id varchar primary key default gen_random_uuid(),
  shop_id varchar not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  stock integer not null default 0,
  category text,
  images jsonb default '[]',
  rating numeric(3,2) default 0.00,
  total_ratings integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp not null default now(),
  constraint items_shop_fk foreign key (shop_id) references shops(id)
);

-- parcels
create table if not exists parcels (
  id varchar primary key default gen_random_uuid(),
  tracking_id text not null unique,
  qr_hash text not null unique,
  sender_id varchar not null,
  recipient_name text not null,
  recipient_phone text not null,
  pickup_partner_id varchar,
  dropoff_partner_id varchar,
  driver_id varchar,
  status parcel_status not null default 'pending',
  weight numeric(5,2) not null,
  distance numeric(6,2),
  price numeric(10,2) not null,
  payment_method payment_method not null,
  is_paid boolean not null default false,
  description text,
  photos jsonb default '[]',
  delivery_proof text,
  rating integer,
  review text,
  created_at timestamp not null default now(),
  delivered_at timestamp,
  constraint parcels_sender_fk foreign key (sender_id) references users(id),
  constraint parcels_driver_fk foreign key (driver_id) references users(id),
  constraint parcels_pickup_partner_fk foreign key (pickup_partner_id) references partners(id),
  constraint parcels_dropoff_partner_fk foreign key (dropoff_partner_id) references partners(id)
);

-- parcel_events
create table if not exists parcel_events (
  id varchar primary key default gen_random_uuid(),
  parcel_id varchar not null,
  actor_id varchar not null,
  actor_role user_role not null,
  status parcel_status not null,
  location text,
  notes text,
  photo text,
  created_at timestamp not null default now(),
  constraint parcel_events_parcel_fk foreign key (parcel_id) references parcels(id),
  constraint parcel_events_actor_fk foreign key (actor_id) references users(id)
);

-- orders
create table if not exists orders (
  id varchar primary key default gen_random_uuid(),
  customer_id varchar not null,
  item_id varchar not null,
  quantity integer not null,
  total_price numeric(10,2) not null,
  parcel_id varchar,
  status order_status not null default 'pending',
  delivery_address text not null,
  delivery_phone text not null,
  payment_method payment_method not null,
  is_paid boolean not null default false,
  rating integer,
  review text,
  created_at timestamp not null default now(),
  completed_at timestamp,
  constraint orders_customer_fk foreign key (customer_id) references users(id),
  constraint orders_item_fk foreign key (item_id) references items(id),
  constraint orders_parcel_fk foreign key (parcel_id) references parcels(id)
);

-- transactions
create table if not exists transactions (
  id varchar primary key default gen_random_uuid(),
  user_id varchar not null,
  amount numeric(10,2) not null,
  type transaction_type not null,
  method payment_method,
  status text not null default 'completed',
  reference text,
  description text,
  created_at timestamp not null default now(),
  constraint transactions_user_fk foreign key (user_id) references users(id)
);

-- messages
create table if not exists messages (
  id varchar primary key default gen_random_uuid(),
  sender_id varchar not null,
  receiver_id varchar not null,
  parcel_id varchar,
  text text not null,
  is_read boolean not null default false,
  created_at timestamp not null default now(),
  constraint messages_sender_fk foreign key (sender_id) references users(id),
  constraint messages_receiver_fk foreign key (receiver_id) references users(id),
  constraint messages_parcel_fk foreign key (parcel_id) references parcels(id)
);

-- notifications
create table if not exists notifications (
  id varchar primary key default gen_random_uuid(),
  user_id varchar not null,
  title text not null,
  body text not null,
  type text,
  reference_id varchar,
  is_read boolean not null default false,
  created_at timestamp not null default now(),
  constraint notifications_user_fk foreign key (user_id) references users(id)
);

-- repositories
create table if not exists repositories (
  id varchar primary key default gen_random_uuid(),
  user_id varchar not null,
  type text not null,
  title text not null,
  content text,
  url text,
  image text,
  tags jsonb default '[]',
  created_at timestamp not null default now(),
  constraint repositories_user_fk foreign key (user_id) references users(id)
);

-- 4) Helpful indexes (idempotent creates via DO blocks)
-- Create indexes if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_parcels_status' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_parcels_status ON parcels(status);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_orders_status' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_orders_status ON orders(status);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'idx_items_shop_id' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_items_shop_id ON items(shop_id);
  END IF;
END $$;

-- 5) Comments for documentation
COMMENT ON TYPE user_role IS 'User roles as defined in shared/schema.ts';
COMMENT ON TYPE parcel_status IS 'Parcel status lifecycle';
COMMENT ON TYPE order_status IS 'Order status enum';
COMMENT ON TYPE transaction_type IS 'Transaction types';
COMMENT ON TYPE payment_method IS 'Payment methods supported';
COMMENT ON TYPE language IS 'Interface language options';
