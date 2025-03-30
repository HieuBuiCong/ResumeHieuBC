-- Step 1: Drop the existing foreign key constraint
ALTER TABLE task_approval_history
DROP CONSTRAINT task_approval_history_cid_task_id_fkey;

-- Step 2: Add the new foreign key with ON DELETE CASCADE
ALTER TABLE task_approval_history
ADD CONSTRAINT task_approval_history_cid_task_id_fkey
FOREIGN KEY (cid_task_id) REFERENCES cid_task(cid_task_id)
ON DELETE CASCADE;
