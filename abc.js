// ✅ Update only the status (User Permission by answering question) - ✅ Includes submitted_date update
export const updateCIDTaskStatus = async (cidTaskId, newStatus) => {
  const query = `
    UPDATE cid_task 
    SET status = $1, submitted_date = CURRENT_TIMESTAMP
    WHERE cid_task_id = $2
    RETURNING *`;

  const { rows } = await pool.query(query, [newStatus, cidTaskId]);
  return rows[0];
};
