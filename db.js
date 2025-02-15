import { updateCIDTaskApproval } from "../models/cid_task.model.js";

// ✅ Admin approves/rejects a submitted task
export const reviewCIDTask = async (req, res) => {
  try {
    const approverId = req.user.id; // Approver's user ID
    const { cid_task_id, decision } = req.body; // decision = "approved" or "rejected"
    const newStatus = decision === "approved" ? 3 : 4; // 3 = Completed, 4 = Rejected

    // ✅ Update task with approval date & approver ID
    const updatedTask = await updateCIDTaskApproval(cid_task_id, newStatus, approverId);
    if (!updatedTask) return res.status(404).json({ message: "CID Task not found" });

    res.status(200).json({ message: `Task status updated to ${decision}`, updatedTask });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
