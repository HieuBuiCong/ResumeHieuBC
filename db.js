import pool from "../config/database.js";

// ✅ Create a new product
export const createProduct = async (model, partNumber, partName, owner) => {
  const query = `
    INSERT INTO product (model, part_number, part_name, owner)
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [model, partNumber, partName, owner];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all products
export const getAllProducts = async () => {
  const query = "SELECT * FROM product ORDER BY product_id ASC";
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a product by ID
export const getProductById = async (productId) => {
  const query = "SELECT * FROM product WHERE product_id = $1";
  const { rows } = await pool.query(query, [productId]);
  return rows[0];
};

// ✅ Update a product
export const updateProduct = async (productId, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);

  const query = `UPDATE product SET ${fields} WHERE product_id = $${values.length + 1} RETURNING *`;

  const { rows } = await pool.query(query, [...values, productId]);
  return rows[0];
};

// ✅ Delete a product
export const deleteProduct = async (productId) => {
  const query = "DELETE FROM product WHERE product_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [productId]);
  return rows[0];
};
