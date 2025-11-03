import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;

  sendResetCode: (email: string) => Promise<boolean>;
  verifyResetCode: (email: string, code: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/register", {
            name,
            email,
            password,
          });
          set({ isLoading: false });
          return response.data.userId;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Registration failed"
              : "Registration failed",
          });
          toast.error("Registration failed");
          return null;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/login", {
            email,
            password,
          });
          set({ isLoading: false, user: response.data.user });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Login failed"
              : "Login failed",
          });
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            toast.error("Incorrect Password or Email.");
          }
          return false;
        }
      },

      sendResetCode: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/forgot-password", { email });
          set({ isLoading: false });
          toast.success("Reset code sent to your email");
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Failed to send reset code"
              : "Failed to send reset code",
          });
          toast.error("Failed to send reset code");
          return false;
        }
      },

      verifyResetCode: async (email: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/verify-reset-code", { email, code });
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Invalid or expired code"
              : "Invalid or expired code",
          });
          toast.error("Invalid or expired code");
          return false;
        }
      },

      resetPassword: async (email, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/reset-password", { email, newPassword });
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Password reset failed"
              : "Password reset failed",
          });
          toast.error("Password reset failed");
          return false;
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/logout");
        } catch {}
        set({ user: null });
        localStorage.removeItem("auth-storage");
        toast.success("Logged out successfully");
      },

      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/check-access", {
            withCredentials: true,
          });
          set({ user: response.data.user, isLoading: false });
        } catch (err: any) {
          console.log("Fetch /check-access response failed");
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
