import express from "express";
import cookieParser from "cookie-parser";  // ✅ Import cookie-parser
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());  // ✅ Enable cookie parsing
app.use(cors({ origin: "http://yourfrontend.com", credentials: true })); // ✅ Allow frontend cookies
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

