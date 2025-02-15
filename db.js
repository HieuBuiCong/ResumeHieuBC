import express from "express";
import {
  getDepartments,
  getDepartment,
  addDepartment,
  removeDepartment
} from "../controllers/department.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Get all departments (Admin Only)
router.get("/", authMiddleware, roleMiddleware("view_departments"), getDepartments);

// ✅ Get a specific department by ID (Admin Only)
router.get("/:id", authMiddleware, roleMiddleware("view_departments"), getDepartment);

// ✅ Create a new department (Admin Only)
router.post("/", authMiddleware, roleMiddleware("create_department"), addDepartment);

// ✅ Delete a department (Admin Only)
router.delete("/:id", authMiddleware, roleMiddleware("delete_department"), removeDepartment);

export default router;
