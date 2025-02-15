mport jwt from "jsonwebtoken";
import config from "../config/dotenv.config.js"; // Load environment variables

const authMiddleware = (req, res, next) => {
  // 1️⃣ Get the Authorization header
  const token = req.header("Authorization");

  // 2️⃣ Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    // 3️⃣ Verify the token
    const decoded = jwt.verify(token.split(" ")[1], config.jwtSecret);

    // 4️⃣ Attach user data to the request
    req.user = decoded;

    // 5️⃣ Move to the next middleware or route
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
