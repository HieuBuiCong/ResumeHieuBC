import {
  createCIDTask,
  getAllCIDTasks,
  getCIDTaskById,
  updateCIDTask,
  deleteCIDTask,
  updateCIDTaskStatus,
  updateCIDTaskApproval,
  getCIDTasksByUser,
  getCIDTasksByCID,
} from "../models/cidTaskModel.js";

// ✅ Create a new CID task (Admin Only)
export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await createCIDTask(taskData);
    res.status(201).json({ success: true, message: "Task created successfully", data: newTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all CID tasks (Users can see all)
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await getAllCIDTasks();
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tasks", error: error.message });
  }
};

// ✅ Get a CID task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getCIDTaskById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving task", error: error.message });
  }
};

// ✅ Update a CID task (Admin Only)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedTask = await updateCIDTask(id, updatedFields);
    if (!updatedTask) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a CID task (Admin Only)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await deleteCIDTask(id);
    if (!deletedTask) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting task", error: error.message });
  }
};

// ✅ Submit Task (Users can only submit their assigned tasks)
export const submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id; // Get logged-in user ID
    const userRole = req.user.role; // Get user role

    // ✅ Fetch the task
    const task = await getCIDTaskById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 🚨 Check if the user is the assigned user or Admin
    if (userRole !== "admin" && task.assignee_id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized. Only the assigned user can submit this task." });
    }

    // ✅ Update task status to "submitted"
    const updatedTask = await updateCIDTaskStatus(id, "submitted");

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      data: updatedTask,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Approve or Reject Task (Admin Only)
export const approveOrRejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const approverId = req.user.user_id; // Get logged-in admin ID

    // ✅ Fetch the task to check if it exists
    const task = await getCIDTaskById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // ✅ Update task with approval status
    const updatedTask = await updateCIDTaskApproval(id, status, approverId);
    
    res.status(200).json({
      success: true,
      message: "Task approved/rejected successfully",
      data: updatedTask,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get tasks assigned to a specific user
export const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await getCIDTasksByUser(userId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tasks", error: error.message });
  }
};

// ✅ Get tasks for a specific CID
export const getTasksByCID = async (req, res) => {
  try {
    const { cid_id } = req.params;
    const tasks = await getCIDTasksByCID(cid_id);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tasks", error: error.message });
  }
};
