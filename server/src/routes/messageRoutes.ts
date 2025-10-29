import express from "express";
import { sendComment } from "../controllers/messageController";

const router = express.Router();
router.post("/send", sendComment);

export default router;
