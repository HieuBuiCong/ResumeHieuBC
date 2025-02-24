-- 🚀 Create the "cid_task" table
CREATE TABLE cid_task (
    cid_task_id SERIAL PRIMARY KEY,
    task_category_id INT NOT NULL,
    cid_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'complete', 'cancel', 'pending', 'overdue', 'submitted')),
    assignee_id INT NOT NULL,
    deadline TIMESTAMP NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    task_approver_id INT,
    submitted_date TIMESTAMP, 
    approval_date TIMESTAMP DEFAULT NULL,
    send_email_to_leader BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (task_category_id) REFERENCES task_category(task_category_id) ON DELETE CASCADE,
    FOREIGN KEY (cid_id) REFERENCES cid(cid_id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (task_approver_id) REFERENCES users(user_id) ON DELETE SET NULL,
    UNIQUE(task_category_id, cid_id)
);
------------------------------------------

-- 🚀 Function to update `approval_date` when status is "complete" or "cancel" ✅
CREATE OR REPLACE FUNCTION task_update_approval_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'complete' OR NEW.status = 'cancel' THEN
        NEW.approval_date = CURRENT_TIMESTAMP;
    ELSE
        NEW.approval_date = NULL;  -- ✅ Ensure it resets to NULL if status is changed back
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🚀 Attach the trigger to update approval_date when needed ✅
CREATE TRIGGER task_status_update
BEFORE INSERT OR UPDATE ON cid_task
FOR EACH ROW
EXECUTE FUNCTION task_update_approval_date();
---------------------------------------------

-- 🚀 Function to check and update overdue status dynamically ✅
CREATE OR REPLACE FUNCTION task_check_overdue_status()
RETURNS TRIGGER AS $$
BEGIN
    -- ✅ If the deadline has passed and status is "in-progress" (ONLY IN-PROGRESS!), set status to "overdue"
    IF NEW.deadline IS NOT NULL AND NEW.deadline < NOW() AND NEW.status = 'in-progress' THEN
        NEW.status = 'overdue';
    END IF;

    -- ✅ If the deadline is changed to a future date and the status is "overdue", reset to "in-progress"
    IF NEW.deadline IS NOT NULL AND NEW.deadline > NOW() AND OLD.status = 'overdue' THEN
        NEW.status = 'in-progress';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🚀 Attach the trigger to check for overdue status dynamically ✅
CREATE TRIGGER cid_task_overdue_check
BEFORE UPDATE OR INSERT ON cid_task
FOR EACH ROW
EXECUTE FUNCTION task_check_overdue_status();
