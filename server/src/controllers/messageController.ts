import { Request, Response } from "express";
import axios from "axios";

export const sendComment = async (req: Request, res: Response): Promise<void> => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ success: false, message: "All fields required." });
    return;
  }

  try {
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwgC_CcWTb1pUOtJ-ZdaBGMiKTA6jXD1SmjjOZr1RzSaU62UPZCOWhZJ_wIFhyPJWGb/exec";

    const response = await axios.post(GOOGLE_SHEET_URL, { name, email, message });

    if (response.data.result === "success") {
      res.status(200).json({ success: true, message: "Comment saved to Google Sheet!" });
    } else {
      res.status(500).json({ success: false, message: "Failed to save comment." });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending comment." });
  }
};
