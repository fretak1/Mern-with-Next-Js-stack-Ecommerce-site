// 📄 routes/orderRoutes.ts

import express from "express";
import {
  createOrder,
  getAllOrdersForAdmin,
  getOrder,
  getOrdersByUserId,
  updateOrderStatus,
  createChapaOrder,
  finalizeChapaOrder,
} from "../controllers/orderController";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-order", authenticateJwt, createOrder);

router.post("/create-chapa-order", authenticateJwt, createChapaOrder);
router.put("/finalize-chapa-order/:txRef", authenticateJwt, finalizeChapaOrder);

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
