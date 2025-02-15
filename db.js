import pool from "../config/database.js"; // PostgreSQL connection

// ✅ Create a new user
export const createUser = async (user) => {
  const { username, password, role_id, department_id, email, leader_email } = user;
  
  const query = `
    INSERT INTO users (username, password, role_id, department_id, email, leader_email)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

  const values = [username, password, role_id, department_id, email, leader_email];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get user by ID
export const getUserById = async (user_id) => {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const { rows } = await pool.query(query, [user_id]);
  return rows[0];
};

// ✅ Get user by username (for authentication)
export const getUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = $1";
  const { rows } = await pool.query(query, [username]);
  return rows[0];
};

// ✅ Get all users
export const getAllUsers = async () => {
  const query = "SELECT * FROM users ORDER BY user_id ASC";
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Update user details
export const updateUser = async (user_id, updateFields) => {
  const fields = Object.keys(updateFields).map((key, index) => `${key} = $${index + 1}`).join(", ");
  const values = Object.values(updateFields);

  const query = `UPDATE users SET ${fields} WHERE user_id = $${values.length + 1} RETURNING *`;

  const { rows } = await pool.query(query, [...values, user_id]);
  return rows[0];
};

// ✅ Delete user
export const deleteUser = async (user_id) => {
  const query = "DELETE FROM users WHERE user_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [user_id]);
  return rows[0];
};
