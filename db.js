CREATE OR REPLACE FUNCTION manage_task_status_updates()
RETURNS TRIGGER AS $$
BEGIN
    -- 🚀 1️⃣ If status is "complete" or "cancel", update approval_date
    IF NEW.status = 'complete' OR NEW.status = 'cancel' THEN
        NEW.approval_date = CURRENT_TIMESTAMP;
    ELSE
        NEW.approval_date = NULL;  -- ✅ Reset approval_date if status is changed back
    END IF;

    -- 🚀 2️⃣ If status is "submitted", update submitted_date
    IF NEW.status = 'submitted' THEN
        NEW.submitted_date = CURRENT_TIMESTAMP;
    END IF;

    -- 🚀 3️⃣ If the deadline has passed and status is "in-progress", set status to "overdue"
    IF NEW.deadline IS NOT NULL AND NEW.deadline < NOW() AND NEW.status = 'in-progress' THEN
        NEW.status = 'overdue';
    END IF;

    -- ✅ If the deadline is extended and the task was "overdue", reset it back to "in-progress"
    IF NEW.deadline IS NOT NULL AND NEW.deadline > NOW() AND OLD.status = 'overdue' THEN
        NEW.status = 'in-progress';
    END IF;

    -- 🚀 4️⃣ **Dependency Logic (Runs After Overdue Check)**
    IF NEW.dependency_cid_id IS NOT NULL THEN
        -- ✅ **If the dependenting task is NOT "complete", "cancel", or "submitted", the dependent task must be "pending"**
        IF (SELECT status FROM cid_task WHERE cid_task_id = NEW.dependency_cid_id) NOT IN ('complete', 'cancel', 'submitted') THEN
            NEW.status = 'pending';
        END IF;

        -- ✅ **If the dependenting task is "complete" or "cancel", update dependent task to "in-progress"**
        IF (SELECT status FROM cid_task WHERE cid_task_id = NEW.dependency_cid_id) IN ('complete', 'cancel') THEN
            NEW.status = 'in-progress';
            NEW.deadline = (SELECT deadline FROM cid_task WHERE cid_task_id = NEW.dependency_cid_id) + NEW.dependency_date;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🚀 Attach the trigger to handle ALL logic in one place
DROP TRIGGER IF EXISTS unified_task_status_trigger ON cid_task;
CREATE TRIGGER unified_task_status_trigger
BEFORE INSERT OR UPDATE ON cid_task
FOR EACH ROW
EXECUTE FUNCTION manage_task_status_updates();
