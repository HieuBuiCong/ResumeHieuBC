import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/dotenv.config.js";
import { createUser, getUserByUsername } from "../models/user.model.js";

// ✅ Register a new user
export const register = async (req, res) => {
  try {
    const { username, password, role_id, department_id, email, leader_email } = req.body;

    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await createUser({
      username,
      password: hashedPassword,
      role_id,
      department_id,
      email,
      leader_email,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, role: user.role_id },
      config.jwtSecret,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
