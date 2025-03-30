export const submitTask = async (req, res) => {
  const { id } = req.params; // `cid_task_id`
  const userId = req.user.id; // Logged-in user ID
  const userRoleId = parseInt(req.user.role, 10);

  try {
    // 1. Get Task Details
    const task = await getCIDTaskById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 2. Check Task Status
    if (['complete', 'cancel', 'submitted'].includes(task.status.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: `Task is already ${task.status}. It cannot be submitted again.` 
      });
    }

    // 3. Check User Authorization
    if (userRoleId !== 1 && task.assignee_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized. Only the assigned user can submit this task." 
      });
    }

    // 4. Mark Task as Submitted
    const updatedTask = await updateTaskStatusLogic(id, "submitted");
    const taskSubmitted = true;

    // 5. Send Email Notification (Non-blocking)
    const cid_id = await getCidIdByCidTaskId(id);
    const [emailNotificationResult] = await Promise.allSettled([
      sendAnswerSubmissionNotification(id),
      updateCIDStatus(cid_id),
    ]);

    const emailSent = emailNotificationResult.status === "fulfilled";

    // 6. Send Response
    res.status(200).json({
      success: true,
      message: "Task submitted successfully.",
      data: updatedTask,
      taskSubmitted,
      emailSent,
    });

  } catch (error) {
    console.error("Task submission error:", {
      errorMessage: error.message,
      taskId: id,
      userId,
    });
    res.status(500).json({ success: false, message: "An error occurred while submitting the task." });
  }
};
