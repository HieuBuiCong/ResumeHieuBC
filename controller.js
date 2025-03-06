import express from "express";
import { login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);    // ✅ Login route
router.post("/logout", logout);  // ✅ Logout route

export default router;
