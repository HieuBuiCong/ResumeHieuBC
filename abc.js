-- Step 1: Drop the existing foreign key constraint
ALTER TABLE task_approval_history
DROP CONSTRAINT task_approval_history_cid_task_id_fkey;

-- Step 2: Add the new foreign key with ON DELETE CASCADE
ALTER TABLE task_approval_history
ADD CONSTRAINT task_approval_history_cid_task_id_fkey
FOREIGN KEY (cid_task_id) REFERENCES cid_task(cid_task_id)
ON DELETE CASCADE;

-----------
CREATE TABLE task_approval_history (
    approval_id SERIAL PRIMARY KEY,
    cid_task_id INT NOT NULL,
    approver_id INT NOT NULL,
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('approve', 'reject')),
    approver_reason TEXT NOT NULL,
    reviewed_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_cid_task
        FOREIGN KEY (cid_task_id) 
        REFERENCES cid_task(cid_task_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_approver
        FOREIGN KEY (approver_id) 
        REFERENCES users(user_id)
);
