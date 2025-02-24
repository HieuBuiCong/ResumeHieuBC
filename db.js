-- Test: Change Parent Task Back to "in-progress"
UPDATE cid_task 
SET status = 'in-progress' 
WHERE cid_task_id = 1;

-- Expected: Task #5 should remain "pending" since it's dependent.
SELECT cid_task_id, status FROM cid_task WHERE cid_task_id = 5;

-- Test: Change Parent Task to "complete"
UPDATE cid_task 
SET status = 'complete' 
WHERE cid_task_id = 1;

-- Expected: Task #5 should now become "in-progress" and inherit deadline.
SELECT cid_task_id, status, deadline FROM cid_task WHERE cid_task_id = 5;
