ALTER TABLE cid_task 
ADD COLUMN dependency_cid_id INT,
ADD COLUMN dependency_date INTERVAL;
ALTER TABLE cid_task 
ADD CONSTRAINT fk_dependency_cid
FOREIGN KEY (dependency_cid_id) REFERENCES cid_task(cid_task_id) ON DELETE SET NULL;
