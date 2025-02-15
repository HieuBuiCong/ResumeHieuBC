import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import productRoutes from "./routes/product.routes.js";
import cidRoutes from "./routes/cid.routes.js";
import cidTaskRoutes from "./routes/cid_task.routes.js";
import taskCategoryRoutes from "./routes/task_category.routes.js";
import taskCategoryQuestionRoutes from "./routes/task_category_question.routes.js";
import { pool } from "./config/database.js";

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Allow frontend requests
app.use(helmet()); // Secure headers

// ✅ Database Connection Check
pool.connect()
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch(err => console.error("❌ Database Connection Error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cids", cidRoutes);
app.use("/api/cid_tasks", cidTaskRoutes);
app.use("/api/task_categories", taskCategoryRoutes);
app.use("/api/task_category_questions", taskCategoryQuestionRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 API is running!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  }
};
