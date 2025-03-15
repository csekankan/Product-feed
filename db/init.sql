DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'product') THEN
        CREATE USER product WITH PASSWORD 'product';
        ALTER USER product WITH SUPERUSER;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'product') THEN
        CREATE DATABASE product;
    END IF;
END $$;

GRANT ALL PRIVILEGES ON DATABASE product TO product;

\c product;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

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
;

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    status_id INTEGER NOT NULL DEFAULT 1 REFERENCES task_status(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL,
    sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    date TIMESTAMP NOT NULL
);
