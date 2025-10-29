import express from "express";
import {
  subscribeToNewsletter,
  getAllSubscribers,
  deleteSubscriber,
} from "../controllers/newsLetterController";

const router = express.Router();

// Public
router.post("/subscribe", subscribeToNewsletter);

// Admin only (optional)
router.get("/getAllSubscribers", getAllSubscribers);
router.delete("/:email", deleteSubscriber);

export default router;
