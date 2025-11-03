import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import { API_ROUTES } from "@/utils/api";
import { Toaster } from "@/components/ui/sonner";

export interface Subscriber {
  email: string;
  createdAt: string;
}

interface NewsletterStore {
  subscribers: Subscriber[];
  isLoading: boolean;
  error?: string | null;
  fetchSubscribers: () => Promise<void>;
  deleteSubscriber: (email: string) => Promise<boolean>;
  subscribeEmail: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
}

export const useNewsletterStore = create<NewsletterStore>((set) => ({
  subscribers: [],
  isLoading: false,

  fetchSubscribers: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${API_ROUTES.NEWSLETTER}/getAllSubscribers`
      );
      if (response.data.success) {
        set({ subscribers: response.data.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      toast.error("Error fetching subscriber:");
    }
  },
  subscribeEmail: async (email: string) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        `${API_ROUTES.NEWSLETTER}/subscribe`,
        { email },
        { withCredentials: true }
      );
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Subscription failed";
      set({ isLoading: false });
      return { success: false, message: msg };
    }
  },
  // Delete a subscriber by email
  deleteSubscriber: async (email: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.delete(`${API_ROUTES.NEWSLETTER}/${email}`);
      if (response.data.success) {
        set((state) => ({
          subscribers: state.subscribers.filter((s) => s.email !== email),
        }));
        set({ isLoading: false });
        return true;
      } else {
        set({ isLoading: false });

        return false;
      }
    } catch (error) {
      toast.error("Error deleting subscriber:");
      return false;
    }
  },
}));
