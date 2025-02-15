CREATE TABLE cid (
    cid_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    prev_rev VARCHAR(50),
    next_rev VARCHAR(50) NOT NULL,
    change_notice VARCHAR(255),
    supplier_id INT,
    rework_or_not BOOLEAN,
    OTS_or_not BOOLEAN,
    sending_date DATE NOT NULL,
    closing_date DATE,
    note TEXT,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);
