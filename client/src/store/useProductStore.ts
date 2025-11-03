import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { toast } from "sonner";
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
  hasFetched: boolean;
  totalPages: number;
  totalProducts: number;
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
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  hasFetched: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,

  fetchAllProductsForAdmin: async () => {
    set({ isLoading: true, error: null, hasFetched: false });
    try {
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-admin-products`,
        { withCredentials: true }
      );
      set({
        products: response.data.allProducts,
        isLoading: false,
        hasFetched: true,
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to fetch product.");
      }

      set({
        error: "Failed to fetch product",
        isLoading: false,
        hasFetched: true,
      });
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to create product.");
      }
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to update product.");
      }
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to delete product.");
      }
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to fetch product.");
      }
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to add review.");
      }
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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to fetch filtered product.");
      }
      set({ error: "Failed to fetch filtered products", isLoading: false });
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
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1000);
      } else {
        toast.error("Failed to fetch product.");
      }
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),
}));
