import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  addProductReview,
  createProduct,
  deleteProduct,
  fetxhAllProductsForAdmin,
  getAllProducts,
  getFilteredProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController";

const router = express.Router();

router.post(
  "/create-new-product",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct
);

router.get(
  "/fetch-admin-products",
  authenticateJwt,
  isSuperAdmin,
  fetxhAllProductsForAdmin
);
router.get("/fetch-filtered-products", getFilteredProducts);
router.get("/getAllProducts", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authenticateJwt, isSuperAdmin, updateProduct);
router.delete("/:id", authenticateJwt, isSuperAdmin, deleteProduct);
router.post("/:productId/review", authenticateJwt, addProductReview);

export default router;
