import { Request, Response } from "express";
import { sendEmail } from "../utils/sendEmail";

export const sendComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ success: false, message: "All fields required." });

    return;
  }

       const subject = `New Comment from ${name}`
       const html = `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`

  sendEmail(email, subject, html)

  
};
