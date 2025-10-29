import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Review {
  id: string;
  userId: string;
  comment?: string;
  rating: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  stock: number;
  rating?: number;
  soldCount: number;
  images: string[];
  productType: string;
  brandCategory: string;
  reviews: Review[];
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  // Product functions
  fetchAllProductsForAdmin: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<Product>;
  updateProduct: (id: string, productData: FormData) => Promise<Product>;
  getAllProducts: () => Promise<void>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Promise<Product | null>;
  addReview: (
    productId: string,
    data: { rating: number; comment?: string }
  ) => Promise<any>;
  getFilteredProducts: (params: {
    page?: number;
    limit?: number;
    categories?: string[];
    sizes?: string[];
    colors?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search: string;
    type: string;
  }) => Promise<void>;
  setCurrentPage: (page: number) => void;
  // Newsletter functions
  subscribeEmail: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  newsletterLoading: boolean;
  newsletterError: string | null;
  newsletterSuccess: string | null;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  newsletterLoading: false,
  newsletterError: null,
  newsletterSuccess: null,

  fetchAllProductsForAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-admin-products`,
        { withCredentials: true }
      );
      set({ products: response.data.allProducts, isLoading: false });
    } catch (e) {
      set({ error: "Failed to fetch product", isLoading: false });
    }
  },

  createProduct: async (productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.PRODUCTS}/create-new-product`,
        productData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: "Failed to create product", isLoading: false });
    }
  },

  updateProduct: async (id: string, productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.PRODUCTS}/${id}`,
        productData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: "Failed to update product", isLoading: false });
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({ error: "Failed to delete product", isLoading: false });
    }
  },

  getProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.product;
    } catch (error) {
      set({ error: "Failed to fetch product", isLoading: false });
    }
  },

  addReview: async (
    productId: string,
    data: { rating: number; comment?: string }
  ) => {
    try {
      const response = await axios.post(
        `${API_ROUTES.PRODUCTS}/${productId}/review`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      return null;
    }
  },

  getFilteredProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = {
        ...params,
        categories: params.categories?.join(","),
        sizes: params.sizes?.join(","),
        colors: params.colors?.join(","),
        brands: params.brands?.join(","),
        type: params.type || "",
      };
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-filtered-products`,
        { params: queryParams, withCredentials: true }
      );
      set({
        products: response.data.products,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPage,
        totalProducts: response.data.totalProduct,
        isLoading: false,
      });
    } catch (e) {
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },

  getAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/getAllProducts`,
        {
          withCredentials: true,
        }
      );
      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),

  // ========================
  // Newsletter subscription
  // ========================
  subscribeEmail: async (email: string) => {
    set({
      newsletterLoading: true,
      newsletterError: null,
      newsletterSuccess: null,
    });
    try {
      const res = await axios.post(
        `${API_ROUTES.NEWSLETTER}/subscribe`,
        { email },
        { withCredentials: true }
      );
      set({ newsletterSuccess: res.data.message, newsletterLoading: false });
      return { success: true, message: res.data.message };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Subscription failed";
      set({ newsletterError: msg, newsletterLoading: false });
      return { success: false, message: msg };
    }
  },
}));
