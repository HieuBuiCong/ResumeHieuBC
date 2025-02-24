const permissions = {
    admin: [
        "create_user", "update_user", "delete_user", "view_users", "view_user",
        "view_departments", "create_department", "delete_department",
        "view_products", "view_products", "create_product", "update_product", "delete_product",
        "view_task_categories", "create_task_category", "update_task_category", "delete_task_category",
        "create_cid", "update_cid", "delete_cid", "manage_cid",
        "create_task_category_question",
        "create_task",
    ],
    user: [
        "view_departments",
        "view_products",
        "view_task_categories",
    ],
};

export default permissions;

--------------
import express from "express";
import {
  //getCIDTasks,
  //getCIDTask,
  addCIDTask,
  //editCIDTask,
  //editCIDTaskStatus,
  //removeCIDTask
} from "../controllers/cid_task.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Admin Controls

    // ✅ Admin creates CID task and assigned user gets notified
router.post("/", authMiddleware, roleMiddleware("create_task"), addCIDTask);
router.put("/:id", authMiddleware, roleMiddleware("update_task"), editCIDTask);
router.delete("/:id", authMiddleware, roleMiddleware("delete_task"), removeCIDTask);

    // ✅ Admin approves/rejects task
router.post("/review", authMiddleware, roleMiddleware("approve_task"), reviewCIDTask);

// ✅ User can see all tasks, but can only submit their assigned tasks
router.get("/", authMiddleware, getCIDTasks);

// ✅ User can submit their assign tasks; Admins can submit for any user
router.post("/submit", authMiddleware, roleMiddleware("update_status"), submitCIDTask);

export default router;


