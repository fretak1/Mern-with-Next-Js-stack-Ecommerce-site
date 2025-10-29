import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import debounce from "lodash/debounce";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, "id">) => Promise<boolean>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => {
  const debounceUpdateCartItemQuantity = debounce(
    async (id: string, quantity: number) => {
      try {
        await axios.put(
          `${API_ROUTES.CART}/update/${id}`,
          { quantity },
          {
            withCredentials: true,
          }
        );
      } catch (e) {
        set({ error: "Failed to update cart quantity" });
      }
    }
  );

  return {
    items: [],
    isLoading: false,
    error: null,
    fetchCart: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_ROUTES.CART}/fetch-cart`, {
          withCredentials: true,
        });

        set({ items: response.data.data, isLoading: false });
      } catch (error) {
        set({ error: "Failed to fetch cart", isLoading: false });
      }
    },
    addToCart: async (item) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.post(
          `${API_ROUTES.CART}/add-to-cart`,
          item,
          {
            withCredentials: true,
          }
        );

        set((state) => ({
          items: [...state.items, response.data.data],
          isLoading: false,
        }));

        return response.data.success;
      } catch (error) {
        set({ error: "Failed to add cart", isLoading: false });
        console.log(error);
      }
    },
    removeFromCart: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await axios.delete(`${API_ROUTES.CART}/remove/${id}`, {
          withCredentials: true,
        });

        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({ error: "Failed to remove the cart", isLoading: false });
      }
    },
    updateCartQuantity: async (id, quantity) => {
      set((state) => ({
        items: state.items.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, quantity } : cartItem
        ),
      }));
      debounceUpdateCartItemQuantity(id, quantity);
    },
    clearCart: async () => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(
          `${API_ROUTES.CART}/clear-cart`,
          {},
          {
            withCredentials: true,
          }
        );

        set({ items: [], isLoading: false });
      } catch (error) {
        set({ error: "Failed to clear the cart", isLoading: false });
      }
    },
  };
});
