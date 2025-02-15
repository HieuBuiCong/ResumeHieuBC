ALTER TABLE cid_task 
ADD COLUMN approval_date TIMESTAMP,
ADD COLUMN task_approver_id INT,
ADD CONSTRAINT fk_task_approver FOREIGN KEY (task_approver_id) REFERENCES users(user_id) ON DELETE SET NULL;
