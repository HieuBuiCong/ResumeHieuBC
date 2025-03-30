/ ✅ Submit Task (Users can only submit their assigned tasks)
export const submitTask = async (req, res) => {
  try {
    const { id } = req.params; // `cid_task_id`
    const userId = req.user.id; // Logged-in user ID
    const userRoleId = parseInt(req.user.role, 10); // User role

    const task = await getCIDTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }

    // 🚨 check if the task is already completed, canceled, or submitted
    if(['complete','cancel', 'submitted'].includes(task.status.toLowerCase())) {
      throw new Error(`Task is already ${task.status}. It cannot be submitted again`);
    }

    // 🚨 Ensure this user is the assignee or an Admin
    if (userRoleId !== 1 && task.assignee_id !== userId) {
      throw new Error("Unauthorized. Only the assigned user can submit this task.");
    }

    // 2) Mark the task as "submitted"
    const updatedTask = await updateTaskStatusLogic(id, "submitted");
    const taskSubmitted = true;

    // 3) Send email notification to Admins & Task Approver
    let emailSent = false
    try{
    await sendAnswerSubmissionNotification(id);
    emailSent = true;
    } catch (emailError) {
      console.error("Failed to send email notification", emailError);
    }

    // 4) 🆕 Call uitility function to apply cid status logic
    const cid_id =  await getCidIdByCidTaskId(id);
    await updateCIDStatus(cid_id);

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      data: updatedTask,
      taskSubmitted,
      emailSent,
    });

  } catch (error) {
    console.log("here is the error message from controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
