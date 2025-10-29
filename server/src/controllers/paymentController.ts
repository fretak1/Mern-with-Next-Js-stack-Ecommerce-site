import axios from "axios";
import { Request, Response } from "express";

const chapaAxios = axios.create({
  baseURL: process.env.CHAPA_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, customerEmail, customerName, txRef } = req.body;
    // Validate fields…

    const resp = await chapaAxios.post("/transaction/initialize", {
      amount,
      currency,
      tx_ref: txRef,
      customer_email: customerEmail,
      customer_name: customerName,
      // you can pass more optional fields (callback_url, customizations etc.)
    });

    if (resp.data.status === "success") {
      return res.status(200).json({
        success: true,
        checkoutUrl: resp.data.data.checkout_url,
        reference: txRef,
      });
    } else {
      return res
        .status(400)
        .json({
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

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { txRef } = req.params; // or body

    const resp = await chapaAxios.get(`/transaction/verify/${txRef}`);

    if (
      resp.data.status === "success" &&
      resp.data.data.status === "successful"
    ) {
      // Update your order in DB: paymentStatus = "completed"
      return res.status(200).json({ success: true, data: resp.data.data });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          message: "Transaction not successful",
          data: resp.data.data,
        });
    }
  } catch (err) {
    console.error("verifyPayment error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
