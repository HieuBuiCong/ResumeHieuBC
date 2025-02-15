import express from "express";
import {
  getTaskCategoryQuestions,
  getTaskCategoryQuestion,
  getQuestionsByCategory,
  addTaskCategoryQuestion,
  editTaskCategoryQuestion,
  removeTaskCategoryQuestion
} from "../controllers/task_category_question.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Get all task category questions (Admin Only)
router.get("/", authMiddleware, roleMiddleware("view_questions"), getTaskCategoryQuestions);

// ✅ Get a specific question by ID (Admin Only)
router.get("/:id", authMiddleware, roleMiddleware("view_questions"), getTaskCategoryQuestion);

// ✅ Get all questions by category ID (Admin Only)
router.get("/category/:categoryId", authMiddleware, roleMiddleware("view_questions"), getQuestionsByCategory);

// ✅ Create a new question (Admin Only)
router.post("/", authMiddleware, roleMiddleware("create_question"), addTaskCategoryQuestion);

// ✅ Update a question (Admin Only)
router.put("/:id", authMiddleware, roleMiddleware("update_question"), editTaskCategoryQuestion);

// ✅ Delete a question (Admin Only)
router.delete("/:id", authMiddleware, roleMiddleware("delete_question"), removeTaskCategoryQuestion);

export default router;
