-- QR Menu Luxury - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (order matters due to FKs, though none yet)
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS restaurant_tables CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restaurant_settings CASCADE;

-- Menu Items
CREATE TABLE menu_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  available BOOLEAN NOT NULL DEFAULT true,
  rating DECIMAL(3,1) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  table_number TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','preparing','ready','served','cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventory
CREATE TABLE inventory (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pcs',
  min_threshold DECIMAL(10,2) NOT NULL DEFAULT 10,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  last_restocked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tables
CREATE TABLE restaurant_tables (
  id BIGSERIAL PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 4,
  location TEXT NOT NULL DEFAULT '',
  qr_code TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','occupied','reserved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Staff
CREATE TABLE staff (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('admin','manager','chef','waiter','host')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  join_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  customer TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  response TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Restaurant Settings (single row table)
CREATE TABLE restaurant_settings (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Luxury Dining',
  description TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  opening_hours_weekdays TEXT NOT NULL DEFAULT '11:00 AM - 10:00 PM',
  opening_hours_weekends TEXT NOT NULL DEFAULT '10:00 AM - 11:00 PM',
  logo TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for menu items and restaurant settings
CREATE POLICY "Allow public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read restaurant_settings" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read restaurant_tables" ON restaurant_tables FOR SELECT USING (true);

-- Allow all operations for authenticated users on all tables
CREATE POLICY "Allow all menu_items" ON menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all restaurant_tables" ON restaurant_tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all staff" ON staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all restaurant_settings" ON restaurant_settings FOR ALL USING (true) WITH CHECK (true);
