import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controllers/addressController";
import { authenticateJwt } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/get-address", authenticateJwt, getAddress);
router.post("/add-address", authenticateJwt, createAddress);
router.delete("/delete-address/:id", authenticateJwt, deleteAddress);
router.put("/update-address/:id", authenticateJwt, updateAddress);

export default router;
