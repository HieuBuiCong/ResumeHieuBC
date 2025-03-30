/**
* ✅ Approve or Reject Task with Reason & History Tracking (Admin Only)
*/
export const approveOrRejectTask = async (req, res) => {
  try {
    const { id } = req.params; // Task ID
    const { decision, approver_reason } = req.body; // Decision & reason
    const approverId = req.user.id; // Logged-in admin ID
 
    if (!["approve", "reject"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Invalid decision. Must be 'approve' or 'reject'." });
    }
 
    if (!approver_reason || approver_reason.trim() === "") {
      return res.status(400).json({ success: false, message: "Approver reason is required." });
    }
 
    // Determine the new task status
    const newStatus = decision === "reject" ? "in-progress" : "complete";
 
    // 🔹 Fetch task details (including assignee)
    const task = await getCIDTaskById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
 
    // 🔹 Update task status - will throw an error and the function stop here
    const updatedTask = await updateTaskStatusLogic(id, newStatus, approverId);
 
    // 🔹 Store Approval/Rejection History
    const saveHistory = await saveTaskApprovalHistory(id, approverId, decision, approver_reason);
    if (!saveHistory) return res.status(404).json({ success: false, message: "Failed to save approval history" });
 
    // 🔹 Send Email Notification to the Assignee
    const emailSent = await sendTaskApprovalNotification(task, decision, approver_reason);
    

    // 🆕 Call uitility function to apply cid status logic
    const cid_id =  await getCidIdByCidTaskId(id);
    await updateCIDStatus(cid_id);
 
    res.status(200).json({
      success: true,
      message: "Review successfully",
      data: updatedTask,
      emailSent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
