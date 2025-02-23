import pool from "../config/database.js";

// ✅ Helper function to get product_id from part_number
const getProductIdFromPartNumber = async (part_number) => {
  const query = `SELECT product_id FROM product WHERE part_number = $1`;
  const { rows } = await pool.query(query, [part_number]);
  return rows[0]?.product_id;
};

// ✅ Create a new CID entry using part_number
export const createCID = async (cidData) => {
  const product_id = await getProductIdFromPartNumber(cidData.part_number);

  if (!product_id) {
    throw new Error(`Product with part number "${cidData.part_number}" not found.`);
  }

  const query = `
    INSERT INTO cid 
    (product_id, prev_rev, next_rev, change_notice, supplier_id, rework_or_not, OTS_or_not, sending_date, note, status, deadline) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, 'in-progress'), $11) 
    RETURNING *`;

  const values = [
    product_id,
    cidData.prev_rev,
    cidData.next_rev,
    cidData.change_notice,
    cidData.supplier_id,
    cidData.rework_or_not,
    cidData.OTS_or_not,
    cidData.sending_date,
    cidData.note,
    cidData.status,  // Defaults to "in-progress"
    cidData.deadline // Defaults to NULL
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all CID entries with part_number included
export const getAllCIDs = async () => {
  const query = `
    SELECT cid.*, product.part_number 
    FROM cid 
    JOIN product ON cid.product_id = product.product_id 
    ORDER BY cid.cid_id ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a CID by ID including part_number
export const getCIDById = async (cidId) => {
  const query = `
    SELECT cid.*, product.part_number 
    FROM cid 
    JOIN product ON cid.product_id = product.product_id 
    WHERE cid.cid_id = $1
  `;
  const { rows } = await pool.query(query, [cidId]);
  return rows[0];
};

// ✅ Update a CID entry using part_number if provided
export const updateCID = async (cidId, updatedFields) => {
  if (updatedFields.part_number) {
    const product_id = await getProductIdFromPartNumber(updatedFields.part_number);
    if (!product_id) {
      throw new Error(`Product with part number "${updatedFields.part_number}" not found.`);
    }
    updatedFields.product_id = product_id;
    delete updatedFields.part_number; // Remove to avoid conflicts
  }

  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const values = Object.values(updatedFields);

  const query = `
    UPDATE cid SET ${fields} 
    WHERE cid_id = $${values.length + 1} 
    RETURNING *
  `;

  const { rows } = await pool.query(query, [...values, cidId]);

  // ✅ Return the updated CID with part_number
  const { rows: updatedRows } = await pool.query(`
    SELECT cid.*, product.part_number
    FROM cid
    JOIN product ON cid.product_id = product.product_id
    WHERE cid.cid_id = $1
  `, [cidId]);

  return updatedRows[0];
};

// ✅ Delete a CID entry
export const deleteCID = async (cidId) => {
  const query = "DELETE FROM cid WHERE cid_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [cidId]);
  return rows[0];
};

// ✅ Check for overdue CIDs (Run periodically)
export const checkOverdueCIDs = async () => {
  const query = `
    UPDATE cid 
    SET status = 'overdue' 
    WHERE deadline IS NOT NULL 
    AND deadline < NOW() 
    AND status = 'in-progress'
    RETURNING *
  `;
  const { rows } = await pool.query(query);
  return rows;
};
