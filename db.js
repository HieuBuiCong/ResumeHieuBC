import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  },
  jwtSecret: process.env.JWT_SECRET || "default_secret_key",
};
