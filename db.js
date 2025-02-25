CREATE TABLE IF NOT EXISTS postpone_reason (
    postpone_reason_id SERIAL PRIMARY KEY,
    cid_task_id INT NOT NULL REFERENCES cid_task(cid_task_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id),
    reason TEXT NOT NULL,
    proposed_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    approver_id INT REFERENCES users(user_id),
    approver_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP
);
