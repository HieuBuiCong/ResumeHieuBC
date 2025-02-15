import express from "express";
import { getUsers, editUser, removeUser } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Users can only see their own profile, Admins can see all users
router.get("/", authMiddleware, getUsers);

// ✅ Only Admins can update or delete users
router.put("/:id", authMiddleware, roleMiddleware("update_user"), editUser);
router.delete("/:id", authMiddleware, roleMiddleware("delete_user"), removeUser);

export default router;
