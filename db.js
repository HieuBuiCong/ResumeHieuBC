import express from "express";
import {
  getTaskCategories,
  getTaskCategory,
  addTaskCategory,
  editTaskCategory,
  removeTaskCategory
} from "../controllers/task_category.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Get all task categories (Admin Only)
router.get("/", authMiddleware, roleMiddleware("view_task_categories"), getTaskCategories);

// ✅ Get a specific task category by ID (Admin Only)
router.get("/:id", authMiddleware, roleMiddleware("view_task_categories"), getTaskCategory);

// ✅ Create a new task category (Admin Only)
router.post("/", authMiddleware, roleMiddleware("create_task_category"), addTaskCategory);

// ✅ Update a task category (Admin Only)
router.put("/:id", authMiddleware, roleMiddleware("update_task_category"), editTaskCategory);

// ✅ Delete a task category (Admin Only)
router.delete("/:id", authMiddleware, roleMiddleware("delete_task_category"), removeTaskCategory);

export default router;
