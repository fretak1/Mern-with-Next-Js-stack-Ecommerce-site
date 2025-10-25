import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface FeatureBanner {
  id: string;
  imageUrl: string;
}

interface settingState {
  banners: FeatureBanner[];
  isLoading: boolean;
  error: string | null;
  featchBanners: () => Promise<void>;
  addBanners: (files: File[]) => Promise<boolean>;
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
}));
