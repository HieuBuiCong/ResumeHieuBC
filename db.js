import pool from "../config/database.js";

// ✅ Create a new CID entry
export const createCID = async (cidData) => {
  const query = `
    INSERT INTO cid 
    (product_id, prev_rev, next_rev, change_notice, supplier_id, rework_or_not, OTS_or_not, sending_date, closing_date, note) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

  const values = [
    cidData.product_id,
    cidData.prev_rev,
    cidData.next_rev,
    cidData.change_notice,
    cidData.supplier_id,
    cidData.rework_or_not,
    cidData.OTS_or_not,
    cidData.sending_date,
    cidData.closing_date,
    cidData.note,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all CIDs
export const getAllCIDs = async () => {
  const query = "SELECT * FROM cid ORDER BY cid_id ASC";
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a CID by ID
export const getCIDById = async (cidId) => {
  const query = "SELECT * FROM cid WHERE cid_id = $1";
  const { rows } = await pool.query(query, [cidId]);
  return rows[0];
};

// ✅ Update a CID entry
export const updateCID = async (cidId, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);

  const query = `UPDATE cid SET ${fields} WHERE cid_id = $${values.length + 1} RETURNING *`;

  const { rows } = await pool.query(query, [...values, cidId]);
  return rows[0];
};

// ✅ Delete a CID entry
export const deleteCID = async (cidId) => {
  const query = "DELETE FROM cid WHERE cid_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [cidId]);
  return rows[0];
};
