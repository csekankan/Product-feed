-- Ensure the database exists before switching
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'product') THEN
        CREATE DATABASE product;
    END IF;
END $$;

-- Ensure UUID extension exists in the correct database
\c product;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the stores table
CREATE TABLE IF NOT EXISTS stores (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    store_id INTEGER NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE
);

-- Create task status table
CREATE TABLE IF NOT EXISTS task_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'pending', 'processing', 'completed', 'failed'
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO task_status (id, status_name)
VALUES
    (1, 'pending'),
    (2, 'processing'),
    (3, 'completed'),
    (4, 'failed')
ON CONFLICT DO NOTHING;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    status_id INTEGER NOT NULL DEFAULT 1 REFERENCES task_status(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    store_id INTEGER NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL,
    sku_id VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    timestamp INTEGER NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER
) PARTITION BY LIST (store_id);

CREATE INDEX idx_products_store_id ON products(store_id);

CREATE TABLE IF NOT EXISTS error_records (
    id SERIAL PRIMARY KEY,
    task_id UUID NOT NULL,
    error_message TEXT NOT NULL,
    row_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO stores (store_name, pincode, country) VALUES
    ('Walmart Supercenter', '10001', 'USA'),
    ('Target Store', '94103', 'USA'),
    ('Best Buy Downtown', '90001', 'USA'),
    ('Costco Wholesale', '60601', 'USA'),
    ('Amazon Fresh', '77001', 'USA'),
    ('Whole Foods Market', '30301', 'USA'),
    ('Kroger Marketplace', '80202', 'USA'),
    ('Safeway Supermarket', '98101', 'USA'),
    ('Publix', '33101', 'USA'),
    ('Aldi', '60602', 'USA'),
    -- Add remaining stores...
    ('Kmart', '48226', 'USA');

DO $$ 
DECLARE 
    store_record RECORD;
BEGIN
    -- Loop through all unique store_id values in the stores table
    FOR store_record IN 
        SELECT store_id FROM stores
    LOOP
        -- Dynamically create the partition for each store_id
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS products_store_%s PARTITION OF products FOR VALUES IN (%s);',
            store_record.store_id, store_record.store_id
        );
    END LOOP;
END $$;
