import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/dotenv.config.js";
import { getUserAuthByUsername } from "../models/user.model.js";


// ✅ Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await getUserAuthByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, role: user.role_id },
      config.jwtSecret,
      { expiresIn: "10h" } // Token expires in 10 hour
    );

    // ✅ Store JWT in HTTP-Only Secure Cookie
    res.cookie("token", token, {
      httpOnly: true, // Cookie Security
      secure: process.env.NODE_ENV === "production", //https enforcement
      sameSite: "Strict", //CSRF Protection
      maxAge: 3600000, // Expiration Control
    });

    res.json({ message: "Login successful"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Logout user
export const logout = (req, res) => {
    try {
        // ✅ Clear the JWT cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        res.status(200).json({message: "Logout sucessfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
