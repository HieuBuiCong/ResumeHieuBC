export const updateCIDStatus = async (cidId, providedStatus = null) => {
    try {
        let newStatus = providedStatus;

        if (!providedStatus) {
            // 🔹 1) Get the Statuses of All Related cid_tasks if status is not provided
            const { rows: tasks } = await pool.query(`
                SELECT status, deadline 
                FROM cid_task 
                WHERE cid_id = $1
            `, [cidId]);

            if (tasks.length === 0) {
                throw new Error(`No tasks found for CID ID: ${cidId}`);
            }

            // 🔹 2) Determine the New CID Status
            newStatus = "pending"; // Default status
            let latestDeadline = null;

            for (const task of tasks) {
                if (task.status === "overdue") {
                    newStatus = "overdue";
                    latestDeadline = task.deadline;
                    break; // Highest priority, no need to check further
                } else if (task.status === "in-progress") {
                    newStatus = "in-progress";
                    latestDeadline = task.deadline;
                } else if (task.status === "submitted" && newStatus !== "in-progress") {
                    newStatus = "submitted";
                    latestDeadline = task.deadline;
                } else if (task.status === "complete" && !["in-progress", "submitted"].includes(newStatus)) {
                    newStatus = "complete";
                    latestDeadline = task.deadline;
                } else if (task.status === "cancel" && !["in-progress", "submitted", "complete"].includes(newStatus)) {
                    newStatus = "cancel";
                    latestDeadline = task.deadline;
                }
            }
        }

        // 🔹 3) Update CID Status & Deadline in Database
        const updatedCID = await pool.query(`
            UPDATE cid
            SET status = $1, 
                deadline = $2
            WHERE cid_id = $3
            RETURNING *;
        `, [newStatus, null, cidId]); // Use null for deadline if not applicable

        console.log(`✅ CID #${cidId} updated to status: ${newStatus}`);
        return updatedCID.rows[0];

    } catch (error) {
        console.error("❌ Error updating CID status:", error);
        throw error;
    }
};
