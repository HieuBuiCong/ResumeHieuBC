-------------------------
CREATE TABLE task_approval_history (
    approval_id SERIAL PRIMARY KEY,
    cid_task_id INT NOT NULL REFERENCES cid_task(cid_task_id),
    approver_id INT NOT NULL REFERENCES users(user_id),
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('approve', 'reject')),
    approver_reason TEXT NOT NULL,
    reviewed_at TIMESTAMP DEFAULT NOW()
);
how to alter this table to when cid_task_id delete cascade
