import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  addFeatureBanners,
  fetchFeatureBanners,
} from "../controllers/settingsController";

const router = express.Router();

router.post(
  "/banners",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  addFeatureBanners
);

router.get("/get-banners", fetchFeatureBanners);

export default router;
