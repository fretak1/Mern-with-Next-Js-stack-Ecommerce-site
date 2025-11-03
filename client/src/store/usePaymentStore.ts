"use client";

import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";
import { toast } from "sonner";

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  checkoutUrl: string | null;

  initializePayment: (data: {
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    txRef: string;
  }) => Promise<void>;

  verifyPayment: (txRef: string) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isLoading: false,
  error: null,
  success: false,
  checkoutUrl: null,

  initializePayment: async (data) => {
    try {
      set({ isLoading: true, error: null, success: false });
      const res = await axios.post(`${API_ROUTES.PAYMENT}/initialize`, data);

      if (res.data.success) {
        set({
          isLoading: false,
          checkoutUrl: res.data.checkoutUrl,
          success: true,
        });
        // Redirect user to Chapa checkout page
        window.location.href = res.data.checkoutUrl;
      } else {
        set({
          isLoading: false,
          error: res.data.message || "Failed to initialize payment",
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error(error.response?.data?.message);
      }
      set({
        isLoading: false,
        error: error.response?.data?.message || "Something went wrong",
      });
    }
  },

  verifyPayment: async (txRef) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`/api/payment/verify/${txRef}`);

      if (res.data.success) {
        set({ success: true, isLoading: false });
      } else {
        set({
          success: false,
          isLoading: false,
          error: res.data.message || "Payment not verified",
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error(error.response?.data?.message);
      }
      set({
        success: false,
        isLoading: false,
        error: error.response?.data?.message || "Verification failed",
      });
    }
  },
}));
