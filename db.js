import pool from "../config/database.js";

// ✅ Create a new department
export const createDepartment = async (departmentName) => {
  const query = `INSERT INTO department (department_name) VALUES ($1) RETURNING *`;
  const values = [departmentName];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all departments
export const getAllDepartments = async () => {
  const query = "SELECT * FROM department ORDER BY department_id ASC";
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a department by ID
export const getDepartmentById = async (departmentId) => {
  const query = "SELECT * FROM department WHERE department_id = $1";
  const { rows } = await pool.query(query, [departmentId]);
  return rows[0];
};

// ✅ Delete a department
export const deleteDepartment = async (departmentId) => {
  const query = "DELETE FROM department WHERE department_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [departmentId]);
  return rows[0];
};
