import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
}

interface couponStore {
  couponList: Coupon[];
  isLoading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  createCoupon: (
    coupon: Omit<Coupon, "id" | "usageCount">
  ) => Promise<Coupon | null>;
  deleteCoupon: (id: string) => Promise<boolean>;
}

export const useCouponStore = create<couponStore>((set, get) => ({
  couponList: [],
  isLoading: false,
  error: null,
  fetchCoupons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.COUPON}/fetch-all-coupons`,
        { withCredentials: true }
      );
      set({ couponList: response.data.couponList, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: "failed to fetch coupons" });
    }
  },
  createCoupon: async (coupon) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_ROUTES.COUPON}/create-coupon`,
        coupon,
        { withCredentials: true }
      );

      set({ isLoading: false });
      return response.data.coupon;
    } catch (error) {
      set({ isLoading: false, error: "failed to Create coupon" });
      return null;
    }
  },
  deleteCoupon: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.delete(`${API_ROUTES.COUPON}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({ isLoading: false, error: "failed to delete coupon" });
      return null;
    }
  },
}));
