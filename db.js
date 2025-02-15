import express from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct
} from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Get all products (Admin Only)
router.get("/", authMiddleware, roleMiddleware("view_products"), getProducts);

// ✅ Get a specific product by ID (Admin Only)
router.get("/:id", authMiddleware, roleMiddleware("view_products"), getProduct);

// ✅ Create a new product (Admin Only)
router.post("/", authMiddleware, roleMiddleware("create_product"), addProduct);

// ✅ Update a product (Admin Only)
router.put("/:id", authMiddleware, roleMiddleware("update_product"), editProduct);

// ✅ Delete a product (Admin Only)
router.delete("/:id", authMiddleware, roleMiddleware("delete_product"), removeProduct);

export default router;
