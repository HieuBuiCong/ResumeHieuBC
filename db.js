CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    part_number VARCHAR(100) NOT NULL UNIQUE,
    part_name VARCHAR(100) NOT NULL,
    owner VARCHAR(255) NULL
);
