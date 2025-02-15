import pool from "../config/database.js";

// ✅ Create a new role
export const createRole = async (roleName) => {
  const query = `INSERT INTO role (role_name) VALUES ($1) RETURNING *`;
  const values = [roleName];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all roles
export const getAllRoles = async () => {
  const query = "SELECT * FROM role ORDER BY role_id ASC";
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a role by ID
export const getRoleById = async (roleId) => {
  const query = "SELECT * FROM role WHERE role_id = $1";
  const { rows } = await pool.query(query, [roleId]);
  return rows[0];
};

// ✅ Delete a role
export const deleteRole = async (roleId) => {
  const query = "DELETE FROM role WHERE role_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [roleId]);
  return rows[0];
};
