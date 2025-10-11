import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface FeatureBanner {
  id: string;
  imageUrl: string;
}

interface FeaturedProducts {
  id: string;
  name: string;
  price: string;
  images: string[];
}

interface settingState {
  banners: FeatureBanner[];
  featuredProducts: FeaturedProducts[];
  isLoading: boolean;
  error: string | null;
  featchBanners: () => Promise<void>;
  featchFeaturedProducts: () => Promise<void>;
  addBanners: (files: File[]) => Promise<boolean>;
  updateFeaturedProducts: (productIds: string[]) => Promise<boolean>;
}

export const useSettingsStore = create<settingState>((set) => ({
  banners: [],
  featuredProducts: [],
  isLoading: false,
  error: null,
  featchBanners: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_ROUTES.SETTINGS}/get-banners`, {
        withCredentials: true,
      });

      set({ banners: response.data.banners, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: "failed to featch banners", isLoading: false });
    }
  },
  featchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `${API_ROUTES.SETTINGS}/fetch-feature-products`,
        {
          withCredentials: true,
        }
      );

      set({
        featuredProducts: response.data.featuredProducts,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ error: "failed to featch banners", isLoading: false });
    }
  },
  addBanners: async (files: File[]) => {
    set({ isLoading: true, error: null });

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const response = await axios.post(
        `${API_ROUTES.SETTINGS}/banners`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/from-data",
          },
        }
      );

      set({
        isLoading: false,
      });

      return response.data.success;
    } catch (error) {
      console.error(error);
      set({ error: "failed to featch banners", isLoading: false });
    }
  },
  updateFeaturedProducts: async (productIds: string[]) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_ROUTES.SETTINGS}/update-feature-banners`,
        { productIds },
        {
          withCredentials: true,
        }
      );

      set({
        isLoading: false,
      });

      return response.data.success;
    } catch (error) {
      console.error(error);
      set({ error: "failed to featch banners", isLoading: false });
    }
  },
}));
