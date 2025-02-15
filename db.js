// ✅ Admin approves/rejects a submitted task
export const reviewCIDTask = async (req, res) => {
  try {
    const { cid_task_id, decision } = req.body; // decision = "approved" or "rejected"
    const newStatus = decision === "approved" ? 3 : 4; // 3 = Completed, 4 = Rejected

    // Fetch CID Task
    const cidTask = await getCIDTaskById(cid_task_id);
    if (!cidTask) return res.status(404).json({ message: "CID Task not found" });

    if (cidTask.status_id !== 2) {
      return res.status(400).json({ message: "Task must be submitted before approval/rejection" });
    }

    // ✅ Update status to "completed" or "rejected"
    await updateCIDTaskStatus(cid_task_id, newStatus, req.user.id);

    res.status(200).json({ message: `Task status updated to ${decision}` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
