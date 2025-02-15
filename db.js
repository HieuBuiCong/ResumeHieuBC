import {
  createTaskCategory,
  getAllTaskCategories,
  getTaskCategoryById,
  updateTaskCategory,
  deleteTaskCategory
} from "../models/task_category.model.js";

// ✅ Get all task categories
export const getTaskCategories = async (req, res) => {
  try {
    const categories = await getAllTaskCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a task category by ID
export const getTaskCategory = async (req, res) => {
  try {
    const category = await getTaskCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: "Task category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a new task category
export const addTaskCategory = async (req, res) => {
  try {
    const { task_name } = req.body;
    if (!task_name) return res.status(400).json({ message: "Task name is required" });

    const category = await createTaskCategory(task_name);
    res.status(201).json({ message: "Task category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a task category
export const editTaskCategory = async (req, res) => {
  try {
    const updatedCategory = await updateTaskCategory(req.params.id, req.body.task_name);
    if (!updatedCategory) return res.status(404).json({ message: "Task category not found" });

    res.status(200).json({ message: "Task category updated successfully", updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a task category
export const removeTaskCategory = async (req, res) => {
  try {
    const deletedCategory = await deleteTaskCategory(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: "Task category not found" });

    res.status(200).json({ message: "Task category deleted successfully", deletedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
