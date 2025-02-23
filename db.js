DROP TABLE IF EXISTS cid CASCADE;

-- 🚀 Create the "cid" table with overdue status logic and proper default values
CREATE TABLE cid (
    cid_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    prev_rev VARCHAR(50),
    next_rev VARCHAR(50) NOT NULL,
    change_notice VARCHAR(255),
    supplier_id INT,
    rework_or_not BOOLEAN,
    OTS_or_not BOOLEAN,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closing_date TIMESTAMP DEFAULT NULL,  -- ✅ Default is NULL (Only updates on "complete" or "cancel")
    note TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'complete', 'cancel', 'pending', 'overdue')),
    deadline TIMESTAMP DEFAULT NULL,  -- ✅ Default is NULL (User sets it when needed)
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);
