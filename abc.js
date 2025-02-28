import pool from "../config/database.js";

// ✅ Function to get CID tasks with filters (including date range filters)
export const getFilteredCIDTasks = async (filters) => {
  let query = `
    SELECT 
      ct.*, 
      tc.task_name, 
      c.cid_id,  
      u1.username AS assignee_name, 
      u2.username AS approver_name 
    FROM cid_task ct
    JOIN users u1 ON ct.assignee_id = u1.user_id
    LEFT JOIN users u2 ON ct.task_approver_id = u2.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    WHERE 1=1`;

  const values = [];
  let index = 1;

  // ✅ Apply filters dynamically
  if (filters.status) {
    query += ` AND ct.status = $${index++}`;
    values.push(filters.status);
  }

  if (filters.assignee_name) {
    query += ` AND u1.username ILIKE $${index++}`;
    values.push(`%${filters.assignee_name}%`);
  }

  if (filters.task_name) {
    query += ` AND tc.task_name ILIKE $${index++}`;
    values.push(`%${filters.task_name}%`);
  }

  if (filters.cid_id) {
    query += ` AND ct.cid_id = $${index++}`;
    values.push(filters.cid_id);
  }

  if (filters.part_number) {
    query += ` AND ct.part_number ILIKE $${index++}`;
    values.push(`%${filters.part_number}%`);
  }

  // ✅ Date range filters (submitted_date, create_date, approval_date, deadline)
  const dateFilters = [
    { field: "submitted_date", start: "submitted_start", end: "submitted_end" },
    { field: "create_date", start: "created_start", end: "created_end" },
    { field: "approval_date", start: "approval_start", end: "approval_end" },
    { field: "deadline", start: "deadline_start", end: "deadline_end" },
  ];

  dateFilters.forEach(({ field, start, end }) => {
    if (filters[start] && filters[end]) {
      query += ` AND ct.${field} BETWEEN $${index++} AND $${index++}`;
      values.push(filters[start], filters[end]);
    }
  });

  query += " ORDER BY ct.cid_task_id ASC";

  const { rows } = await pool.query(query, values);
  return rows;
};
-------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------
// ✅ Get all CID tasks with optional filters (including date range filters)
export const getFilteredTasks = async (req, res) => {
  try {
    const filters = req.query; // Extract filters from query parameters
    const tasks = await getFilteredCIDTasks(filters);

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tasks", error: error.message });
  }
};
--------------------------------------------------
router.get("/", authMiddleware, getFilteredTasks);
