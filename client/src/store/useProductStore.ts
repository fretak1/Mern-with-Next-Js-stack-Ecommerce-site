import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";


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
}

interface ProductState {
    products : Product[]
    isLoading : boolean;
    error : string | null;
    fetchAllProductsForAdmin : ()=> Promise<void>;
    createProduct? : (productData : FormData)=> Promise<void>;
    updateProduct? : (id : string, productData : FormData)=> Promise<void>;
    deleteProduct? : (id : string)=> Promise<void>;
}

export const useProductStore = create<ProductState>((set,get) => ({
    products : [],
    isLoading : false,
    error : null,
    fetchAllProductsForAdmin: async () => {
    set({ isLoading: true, error: null });
     
    try {
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-admin-products`,
        {
          withCredentials: true,
        }
      );

      set({ products: response.data, isLoading: false });
    } catch (e) {
      set({ error: "Failed to fetch product", isLoading: false });
    }
  },
}))