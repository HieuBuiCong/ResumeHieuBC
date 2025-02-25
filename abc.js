import { requestExtension, getExtensions, reviewExtension } from "../controllers/cid_task.controller.js";

const router = express.Router();

// ✅ User requests a deadline extension
router.post("/:id/extend", authMiddleware, requestExtension);

// ✅ Approver gets all extension requests
router.get("/extensions", authMiddleware, roleMiddleware("approve_task"), getExtensions);

// ✅ Approver reviews and approves/rejects the request
router.put("/extensions/:id/review", authMiddleware, roleMiddleware("approve_task"), reviewExtension);

export default router;
