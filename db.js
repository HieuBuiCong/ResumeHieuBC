import pool from "../config/database.js";

/**
 * ✅ User requests a deadline extension.
 * - Only allowed for "in-progress" or "overdue" tasks.
 * - User can only request an extension for their **own** task.
 * - Prevents duplicate requests (only one "pending" request per task).
 * - Proposed date **must** be in the future (after the current deadline).
 */
export const requestDeadlineExtension = async (cidTaskId, userId, reason, proposedDate) => {
    try {
        // ✅ Check if the task exists and fetch necessary details
        const { rows: taskRows } = await pool.query(
            `SELECT deadline, status, assignee_id FROM cid_task WHERE cid_task_id = $1`, 
            [cidTaskId]
        );

        // ❌ If task does not exist, return an error
        if (taskRows.length === 0) throw new Error("Task not found.");

        const task = taskRows[0];

        // ❌ Ensure the user is the **assigned** user for this task
        if (task.assignee_id !== userId) throw new Error("You can only extend tasks assigned to you.");

        // ❌ Ensure the task status is either "in-progress" or "overdue"
        if (!["in-progress", "overdue"].includes(task.status)) {
            throw new Error("Only 'in-progress' or 'overdue' tasks can request an extension.");
        }

        // ❌ Ensure the proposed deadline is **after** the current deadline
        if (new Date(proposedDate) <= new Date(task.deadline)) {
            throw new Error("Proposed date must be after the current deadline.");
        }

        // ✅ Prevent duplicate extension requests
        const { rows: existingRequests } = await pool.query(
            `SELECT * FROM postpone_reason WHERE cid_task_id = $1 AND status = 'pending'`, 
            [cidTaskId]
        );
        if (existingRequests.length > 0) throw new Error("There is already a pending extension request for this task.");

        // ✅ Insert the new extension request into the `postpone_reason` table
        const query = `
            INSERT INTO postpone_reason (cid_task_id, user_id, reason, proposed_date, status)
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [cidTaskId, userId, reason, proposedDate]);
        return rows[0];
    } catch (error) {
        console.error("❌ Error in requestDeadlineExtension:", error);
        throw error;
    }
};

/**
 * ✅ Get all pending extension requests (for approvers).
 * - Includes `requester`, `task_name`, and `cid_id` for better readability.
 */
export const getDeadlineExtensionRequests = async () => {
    try {
        const query = `
            SELECT pr.*, u.username AS requester, c.cid_id, t.task_name 
            FROM postpone_reason pr
            JOIN users u ON pr.user_id = u.user_id
            JOIN cid_task t ON pr.cid_task_id = t.cid_task_id
            JOIN cid c ON t.cid_id = c.cid_id
            ORDER BY pr.created_at DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error("❌ Error in getDeadlineExtensionRequests:", error);
        throw error;
    }
};

/**
 * ✅ Approver reviews and approves/rejects the request.
 * - If **approved**, updates the task's `deadline` in `cid_task`.
 * - If **approved**, also sets task status back to `"in-progress"`.
 * - Stores the **approver's decision** and reason in `postpone_reason`.
 * - Uses **transactions** to ensure database integrity.
 */
export const reviewDeadlineExtension = async (postponeReasonId, approverId, decision, approverReason) => {
    const client = await pool.connect(); // ✅ Begin transaction
    try {
        let newDeadline = null;

        // ✅ Fetch the requested `proposed_date` and `cid_task_id`
        const { rows } = await client.query(
            `SELECT proposed_date, cid_task_id FROM postpone_reason WHERE postpone_reason_id = $1`, 
            [postponeReasonId]
        );
        if (rows.length === 0) throw new Error("Deadline extension request not found.");

        const { proposed_date, cid_task_id } = rows[0];

        // ✅ If the request is **approved**, update the task's `deadline`
        if (decision === "approved") {
            newDeadline = proposed_date;

            // ✅ Update `cid_task.deadline` and set status to "in-progress"
            await client.query(
                `UPDATE cid_task SET deadline = $1, status = 'in-progress' WHERE cid_task_id = $2`, 
                [newDeadline, cid_task_id]
            );
        }

        // ✅ Update `postpone_reason` table with approver's decision
        const updateQuery = `
            UPDATE postpone_reason
            SET status = $1, approver_id = $2, approver_reason = $3, reviewed_at = NOW()
            WHERE postpone_reason_id = $4
            RETURNING *;
        `;
        const { rows: updatedRows } = await client.query(updateQuery, [decision, approverId, approverReason, postponeReasonId]);

        await client.query("COMMIT"); // ✅ Commit transaction
        return updatedRows[0];
    } catch (error) {
        await client.query("ROLLBACK"); // ❌ Rollback on failure
        console.error("❌ Error in reviewDeadlineExtension:", error);
        throw error;
    } finally {
        client.release(); // ✅ Release connection
    }
};
