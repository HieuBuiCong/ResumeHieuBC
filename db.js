-- 🚀 Function to update `approval_date` when status is "complete" or "cancel" , submited_date when status is "submitted"✅
CREATE OR REPLACE FUNCTION task_update_approval_date()
RETURNS TRIGGER AS $$
BEGIN
    -- ✅ If status is "complete" or "cancel", update `approval_date`
    IF NEW.status = 'complete' OR NEW.status = 'cancel' THEN
        NEW.approval_date = CURRENT_TIMESTAMP;
    ELSE
        NEW.approval_date = NULL;  -- ✅ Ensure it resets to NULL if status is changed back
    END IF;

    -- ✅ if status is "submitted", update `submitted_date`
    IF NEW.status = 'submitted' THEN
        NEW.submitted_date = CURRENT_TIMESTAMP;
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
