import express from "express";
import {
  capturePaypalOrder,
  createOrder,
  createPaypalOrder,
  getAllOrdersForAdmin,
  getOrder,
  getOrdersByUserId,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-paypal-order", createPaypalOrder);
router.post("/capture-paypal-order", capturePaypalOrder);
router.post("/create-order", authenticateJwt, createOrder);
router.get("/get-single-order/:orderId", authenticateJwt, getOrder);
router.get("/get-order-by-user-id", authenticateJwt, getOrdersByUserId);
router.get(
  "/get-all-order-for-admin",
  authenticateJwt,
  isSuperAdmin,
  getAllOrdersForAdmin
);
router.put(
  "/:orderId/status",
  authenticateJwt,
  isSuperAdmin,
  updateOrderStatus
);

export default router;
