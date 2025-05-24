-- Database schema for Hayloft Woodshed
-- This script creates all the necessary tables for the application

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255),
    thumbnail VARCHAR(255),
    price DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    featured BOOLEAN DEFAULT false,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50),
    description TEXT,
    dimensions VARCHAR(255),
    materials TEXT
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Product attributes table
CREATE TABLE IF NOT EXISTS product_attributes (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(36) REFERENCES products(id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value TEXT
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Initial data for categories
INSERT INTO categories (id, name, description) 
VALUES 
('woodwork', 'Woodwork', 'Handcrafted wooden items'),
('knits', 'Knits', 'Hand-knitted items'),
('paintings', 'Paintings', 'Original paintings and artwork')
ON CONFLICT (id) DO NOTHING;
