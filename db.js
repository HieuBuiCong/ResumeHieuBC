import pool from "../config/database.js";

// ✅ Approve or Reject Task (Updates `approval_date` and `task_approver_id`)
export const updateCIDTaskApproval = async (cidTaskId, statusId, approverId) => {
  const query = `
    UPDATE cid_task 
    SET status_id = $1, approval_date = CURRENT_TIMESTAMP, task_approver_id = $2 
    WHERE cid_task_id = $3
    RETURNING *`;

  const { rows } = await pool.query(query, [statusId, approverId, cidTaskId]);
  return rows[0];
};
