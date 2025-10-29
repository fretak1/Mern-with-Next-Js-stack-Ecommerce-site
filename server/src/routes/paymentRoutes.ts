import express from "express";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/paymentController";

const router = express.Router();

router.post("/initialize", initializePayment);
router.get("/verify/:txRef", verifyPayment);

export default router;
