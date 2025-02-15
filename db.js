import {
  createCIDTask,
  getAllCIDTasks,
  getCIDTaskById,
  updateCIDTask,
  updateCIDTaskStatus,
  deleteCIDTask
} from "../models/cid_task.model.js";

// ✅ Get all CID tasks (Admin Only)
export const getCIDTasks = async (req, res) => {
  try {
    const tasks = await getAllCIDTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a CID task by ID
export const getCIDTask = async (req, res) => {
  try {
    const task = await getCIDTaskById(req.params.id);
    if (!task) return res.status(404).json({ message: "CID task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a new CID task (Admin Only)
export const addCIDTask = async (req, res) => {
  try {
    const { task_category_id, cid_id, status_id, user_id, deadline } = req.body;

    if (!task_category_id || !cid_id || !status_id || !user_id || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const task = await createCIDTask(req.body);
    res.status(201).json({ message: "CID task created successfully", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a CID task (Admin Only)
export const editCIDTask = async (req, res) => {
  try {
    const updatedTask = await updateCIDTask(req.params.id, req.body);
    if (!updatedTask) return res.status(404).json({ message: "CID task not found" });

    res.status(200).json({ message: "CID task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update only the status (User Permission)
export const editCIDTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status_id } = req.body;

    const updatedTask = await updateCIDTaskStatus(req.params.id, status_id, userId);
    if (!updatedTask) return res.status(403).json({ message: "Not authorized to update this task" });

    res.status(200).json({ message: "Task status updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a CID task (Admin Only)
export const removeCIDTask = async (req, res) => {
  try {
    const deletedTask = await deleteCIDTask(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "CID task not found" });

    res.status(200).json({ message: "CID task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
