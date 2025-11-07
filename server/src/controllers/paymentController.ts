import axios from "axios";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

const chapaAxios = axios.create({
  baseURL: process.env.CHAPA_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const APP_BASE_URL = process.env.APP_BASE_URL;

    if (!APP_BASE_URL) {
      return res.status(500).json({
        success: false,
        message: "Server configuration missing APP_BASE_URL.",
      });
    }

    const { amount, currency, customerEmail, customerName, txRef } = req.body;
    const returnUrl = `https://mern-with-next-js-stack-ecommerce-s.vercel.app/checkout/success/${txRef}`;

    const resp = await chapaAxios.post("/transaction/initialize", {
      amount,
      currency,
      tx_ref: txRef,
      customer_email: customerEmail,
      customer_name: customerName,
      return_url: returnUrl,
    });

    if (resp.data.status === "success") {
      return res.status(200).json({
        success: true,
        checkoutUrl: resp.data.data.checkout_url,
        reference: txRef,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Chapa init failed",
        details: resp.data,
      });
    }
  } catch (err) {
    console.error("initializePayment error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyPayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { txRef } = req.params;

    if (!txRef) {
      return res.status(400).json({
        success: false,
        message: "Missing transaction reference",
      });
    }

    const chapaRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const verificationData = chapaRes.data;

    if (
      verificationData.status === "success" &&
      verificationData.data.status === "success"
    ) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: verificationData.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: verificationData.data,
      });
    }
  } catch (error: any) {
    console.error("Verify payment error:", error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message || "Internal Server Error",
    });
  }
};
