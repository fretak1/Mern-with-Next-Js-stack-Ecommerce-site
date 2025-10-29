import { Request, Response } from "express";
import { prisma } from "../server";

// ✅ Add new subscription
export const subscribeToNewsletter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid email address.",
        });
      return;
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      res
        .status(200)
        .json({ success: false, message: "You are already subscribed!" });
      return;
    }

    // Create subscription
    await prisma.newsletter.create({ data: { email } });
    res
      .status(201)
      .json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({ success: false, message: "Failed to subscribe." });
  }
};

// ✅ Get all subscribers (admin use)
export const getAllSubscribers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subscribers = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch subscribers." });
  }
};

// ✅ Delete subscriber (optional, for admin)
export const deleteSubscriber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;

    await prisma.newsletter.delete({
      where: { email },
    });

    res.status(200).json({ success: true, message: "Subscriber removed." });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete subscriber." });
  }
};
