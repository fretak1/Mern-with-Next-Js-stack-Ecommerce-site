import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface ChapaFinalizeResponse {
  success: boolean;
  message: string;
  order: {
    id: string;
    userId: string;
    addressId: string;
    couponId: string | null;
    total: number;
    status: OrderStatus;
    paymentMethod: "CHAPA" | "CASH" | "CREDIT_CARD";
    paymentStatus: "PENDING" | "COMPLETED";
    paymentId: string | null;
    txRef: string;
    createdAt: string;
    updatedAt: string;
    items: {
      id: string;
      orderId: string;
      productId: string;
      productName: string;
      productCategory: string;
      quantity: number;
      size?: string;
      color?: string;
      price: number;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}


type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: "CREDIT_CARD" | "CHAPA" | "CASH";
  paymentStatus: "PENDING" | "COMPLETED";
  txRef?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  addressId: string;
  items: OrderItem[];
  couponId?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: "CREDIT_CARD" | "CHAPA" | "CASH";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  txRef?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  address: {
    id: string;
    name: string;
    city?: string;
    address?: string;
    phone?: string;
    country?: string;
    postalCode: string;
  };
}

interface CreateOrderPayload {
  userId: string;
  addressId: string;
  items: Omit<OrderItem, "id">[];
  couponId?: string;
  total: number;
  paymentMethod: "CREDIT_CARD" | "CHAPA" | "CASH";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  txRef?: string;
}

interface CreateOrderData
  extends Omit<
    CreateOrderPayload,
    "paymentMethod" | "paymentStatus" | "txRef"
  > {
  paymentMethod: "CASH" | "CREDIT_CARD";
  paymentStatus: "PENDING" | "COMPLETED";
  paymentId?: string;
  txRef?: string;
}

interface OrderStore {
  currentOrder: Order | null;
  isLoading: boolean;
  isPaymentProcessing: boolean;
  userOrders: Order[];
  adminOrders: AdminOrder[];
  error: string | null;
  createChapaOrder: (
    orderData: Omit<CreateOrderPayload, "paymentId" | "paymentStatus"> & {
      txRef: string;
      paymentMethod: "CHAPA";
      paymentStatus: "PENDING";
    }
  ) => Promise<Order | null>;

  finalizeChapaOrder: (txRef: string ) => Promise<boolean>;
  createOrder: (orderData: CreateOrderData) => Promise<Order | null>;
  getOrder: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  getAllOrders: () => Promise<AdminOrder[] | null>;
  getOrdersByUserId: () => Promise<Order[] | null>;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  currentOrder: null,
  isLoading: true,
  error: null,
  isPaymentProcessing: false,
  userOrders: [],
  adminOrders: [],

createChapaOrder: async (orderData) => {
  set({ isLoading: true, error: null, isPaymentProcessing: true });

  try {
    const response = await axios.post(
      `${API_ROUTES.ORDER}/create-chapa-order`,
      orderData,
      { withCredentials: true }
    );

    set({
      isLoading: false,
      currentOrder: response.data,
      isPaymentProcessing: false,
    });

    return response.data;
  } catch (error: unknown) {
    const defaultMsg = "Failed to create PENDING Chapa Order";
    let msg = defaultMsg;

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        msg = error.response?.data?.message || defaultMsg;
        toast.error(msg);
      }
    } else if (error instanceof Error) {
      msg = error.message;
      toast.error(msg);
    } else {
      toast.error(defaultMsg);
    }

    set({
      isLoading: false,
      isPaymentProcessing: false,
      error: msg,
    });

    return null;
  }
},


  finalizeChapaOrder: async (txRef : string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.ORDER}/finalize-chapa-order/${txRef}`,
        { },
        { withCredentials: true }
      );

      if (response.data.success) {
        set({
          isLoading: false,
          currentOrder: response.data.order,
        });
        return true;
      } else {
        set({ isLoading: false, error: response.data.message });
        return false;
      }
    } catch (error: unknown) {
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
        error:
          error.response?.data?.message || "Failed to finalize Chapa order",
      });
      return false;
    }
  },
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null, isPaymentProcessing: true });
    try {
      const response = await axios.post(
        `${API_ROUTES.ORDER}/create-order`,
        orderData,
        { withCredentials: true }
      );

      set({
        isLoading: false,
        currentOrder: response.data,
        isPaymentProcessing: false,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        // Optional redirect after a delay
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to Create Order");
      }
      set({
        isLoading: false,
        isPaymentProcessing: false,
        error: "Failed to Create Order",
      });

      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(
        `${API_ROUTES.ORDER}/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      set((state) => ({
        currentOrder:
          state.currentOrder && state.currentOrder.id === orderId
            ? {
                ...state.currentOrder,
                status,
              }
            : state.currentOrder,
        isLoading: false,
        adminOrders: state.adminOrders.map((item) =>
          item.id === orderId
            ? {
                ...item,
                status,
              }
            : item
        ),
      }));
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to update order status");
      }
      set({ error: "Failed to update order status", isLoading: false });
      return false;
    }
  },

  getAllOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-all-order-for-admin`,
        { withCredentials: true }
      );

      set({ isLoading: false, adminOrders: response.data });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        // Optional redirect after a delay
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to get Orders");
      }
      set({ isLoading: false, error: "Failed to get Orders" });
      return null;
    }
  },

  getOrdersByUserId: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-order-by-user-id`,
        { withCredentials: true }
      );

      set({ isLoading: false, userOrders: response.data });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        // Optional redirect after a delay
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to get Orders");
      }
      set({ isLoading: false, error: "Failed to get Orders" });
      return null;
    }
  },

  getOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.ORDER}/get-single-order/:${orderId}`,
        { withCredentials: true }
      );

      set({ isLoading: false, currentOrder: response.data });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        // Optional redirect after a delay
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to get Orders");
      }
      set({ isLoading: false, error: "Failed to get Order" });
      return null;
    }
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),
}));
