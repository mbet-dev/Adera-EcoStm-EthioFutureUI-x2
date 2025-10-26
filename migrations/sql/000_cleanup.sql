-- Drop all existing tables and types
DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Drop tables with foreign key dependencies first
  DROP TABLE IF EXISTS 
    repositories,
    notifications,
    messages,
    transactions,
    orders,
    parcel_events,
    parcels,
    items,
    shops,
    partners,
    users CASCADE;

  -- Drop custom types
  DROP TYPE IF EXISTS 
    user_role,
    parcel_status,
    order_status,
    transaction_type,
    payment_method,
    language CASCADE;
END $$;