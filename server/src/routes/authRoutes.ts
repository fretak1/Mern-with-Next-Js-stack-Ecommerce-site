import express from "express";
import {
  checkAccess,
  forgotPassword,
  login,
  logout,
  refereshAccessToken,
  register,
  resetPassword,
  verifyResetCode,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refereshAccessToken);
router.post("/logout", logout);
router.get("/check-Access", checkAccess);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
export default router;
