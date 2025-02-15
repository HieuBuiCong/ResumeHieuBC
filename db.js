import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  deleteDepartment
} from "../models/department.model.js";

// ✅ Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await getAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a department by ID
export const getDepartment = async (req, res) => {
  try {
    const department = await getDepartmentById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a new department
export const addDepartment = async (req, res) => {
  try {
    const { department_name } = req.body;
    if (!department_name) return res.status(400).json({ message: "Department name is required" });

    const department = await createDepartment(department_name);
    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a department
export const removeDepartment = async (req, res) => {
  try {
    const deletedDepartment = await deleteDepartment(req.params.id);
    if (!deletedDepartment) return res.status(404).json({ message: "Department not found" });

    res.status(200).json({ message: "Department deleted successfully", deletedDepartment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
