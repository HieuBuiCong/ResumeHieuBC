CREATE OR REPLACE FUNCTION manage_task_status_updates()
RETURNS TRIGGER AS $$
BEGIN
    -- 🚀 1️⃣ If status is "complete" or "cancel", update approval_date
    IF NEW.status = 'complete' OR NEW.status = 'cancel' THEN
        NEW.approval_date = CURRENT_TIMESTAMP;
    ELSE
        NEW.approval_date = NULL;  -- ✅ Reset approval_date if status is changed back
    END IF;

    -- -- 🚀 2️⃣ If status is "submitted", update submitted_date
    -- UpdateCIDTaskStatus function in cid_task.model.js

    -- 🚀 3️⃣ If the deadline has passed and status is "in-progress", set status to "overdue"
    IF NEW.deadline IS NOT NULL AND NEW.deadline < NOW() AND NEW.status = 'in-progress' THEN
        NEW.status = 'overdue';
    END IF;

    -- ✅ If the deadline is extended and the task was "overdue", reset it back to "in-progress"
    IF NEW.deadline IS NOT NULL AND NEW.deadline > NOW() AND OLD.status = 'overdue' THEN
        NEW.status = 'in-progress';
    END IF;

    -- 🚀 4️⃣ **Explicitly Force Dependent Tasks to "Pending"**
    -- ✅ If the current task is not complete or cancel, update all dependent tasks that are NOT "complete", "submitted", or "cancel"
    IF NEW.status NOT IN ('complete', 'cancel') THEN
        UPDATE cid_task 
        SET status = 'pending'
        WHERE dependency_cid_id = NEW.cid_task_id 
        AND status NOT IN ('complete', 'submitted', 'cancel');
    END IF;

    -- ✅ If the dependenting task is "complete" or "cancel", update dependent task to "in-progress" or "overdue"
    -- ✅ Only apply this update if the dependent task is NOT already "complete", "submitted", or "cancel"
    IF NEW.status IN ('complete', 'cancel') THEN
        -- 🚀 Set deadline.
        UPDATE cid_task 
        SET deadline = (NEW.approval_date + dependency_date) 
        WHERE dependency_cid_id = NEW.cid_task_id
        AND status NOT IN ('complete', 'submitted', 'cancel');  -- 🚀 Prevents updates to completed/submitted tasks
        -- 🚀 Set status = in-progress.
        UPDATE cid_task 
        SET status = 'in-progress' 
        WHERE dependency_cid_id = NEW.cid_task_id
        AND status NOT IN ('complete', 'submitted', 'cancel')  
        AND deadline IS NOT NULL AND deadline > NOW(); -- 🚀 deadline is not due.
        -- 🚀 Set status = overdue.
        UPDATE cid_task 
        SET status = 'overdue' 
        WHERE dependency_cid_id = NEW.cid_task_id
        AND status NOT IN ('complete', 'submitted', 'cancel')  
        AND deadline IS NOT NULL AND deadline < NOW(); -- 🚀 deadline is due.
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 🚀 Attach the trigger to handle ALL logic in one place
DROP TRIGGER IF EXISTS unified_task_status_trigger ON cid_task;
CREATE TRIGGER unified_task_status_trigger
AFTER INSERT OR UPDATE ON cid_task
FOR EACH ROW
EXECUTE FUNCTION manage_task_status_updates();
