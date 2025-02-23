-- 🚀 Drop table if it already exists (optional)
DROP TABLE IF EXISTS cid CASCADE;

-- 🚀 Create the "cid" table with correct overdue logic
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

-- 🚀 Function to update `closing_date` when status is "complete" or "cancel"
CREATE OR REPLACE FUNCTION update_closing_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'complete' OR NEW.status = 'cancel' THEN
        NEW.closing_date = CURRENT_TIMESTAMP;
    ELSE
        NEW.closing_date = NULL;  -- ✅ Ensure it resets to NULL if status is changed back
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🚀 Attach the trigger to update closing_date when needed
CREATE TRIGGER cid_status_update
BEFORE INSERT OR UPDATE ON cid
FOR EACH ROW
EXECUTE FUNCTION update_closing_date();

-- 🚀 Function to mark CIDs as "overdue" if the deadline has passed (ONLY WHEN IN-PROGRESS)
CREATE OR REPLACE FUNCTION check_overdue_status()
RETURNS TRIGGER AS $$
BEGIN
    -- ✅ If the deadline has passed and status is "in-progress" (ONLY IN-PROGRESS!), set status to "overdue"
    IF NEW.deadline IS NOT NULL AND NEW.deadline < NOW() AND NEW.status = 'in-progress' THEN
        NEW.status = 'overdue';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🚀 Attach the trigger to check for overdue status
CREATE TRIGGER cid_overdue_check
BEFORE UPDATE OR INSERT ON cid
FOR EACH ROW
EXECUTE FUNCTION check_overdue_status();
