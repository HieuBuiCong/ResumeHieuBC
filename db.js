import express from "express";
import {
  addTaskCategoryQuestion,
  getTaskCategoryQuestions,
  getTaskCategoryQuestion,
  getQuestionsByTask,
  editTaskCategoryQuestion,
  removeTaskCategoryQuestion,
} from "../controllers/taskCategoryQuestion.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Create a new task category question (using task_name)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("create_task_category_question"),
  addTaskCategoryQuestion
);

// ✅ Get all task category questions
router.get("/", authMiddleware, getTaskCategoryQuestions);

// ✅ Get a task category question by ID
router.get("/:id", authMiddleware, getTaskCategoryQuestion);

// ✅ Get task category questions by task name
router.get("/task/:task_name", authMiddleware, getQuestionsByTask);

// ✅ Update a task category question
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("update_task_category_question"),
  editTaskCategoryQuestion
);

// ✅ Delete a task category question
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("delete_task_category_question"),
  removeTaskCategoryQuestion
);

export default router;
