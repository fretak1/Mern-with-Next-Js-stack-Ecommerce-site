import { Toaster } from "@/components/ui/sonner";
import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

type CommentStore = {
  isSending: boolean;
  success: string | null;
  error: string | null;
  sendComment: (name: string, email: string, message: string) => Promise<void>;
};

export const useMessageStore = create<CommentStore>((set) => ({
  isSending: false,
  success: null,
  error: null,

  sendComment: async (name, email, message) => {
    set({ isSending: true, error: null, success: null });
    try {
      const res = await axios.post(`${API_ROUTES.COMMENTS}/send`, {
        name,
        email,
        message,
      });

      if (res.data.success) {
        set({
          isSending: false,
          success: "Your message has been sent successfully!",
        });
        toast("Your message has been sent successfully!");
      } else {
        set({
          isSending: false,
          error: res.data.message || "Failed to send comment.",
        });
      }
    } catch (error) {
      set({
        isSending: false,
        error: "An error occurred while sending your message.",
      });
    }
  },
}));
