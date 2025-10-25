import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface AddressStore {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  featchAddress: () => Promise<void>;
  createAddress: (address: Omit<Address, "id">) => Promise<Address | null>;
  updateAddress: (
    id: string,
    address: Partial<Address>
  ) => Promise<Address | null>;
  deleteAddress: (id: string) => Promise<boolean>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,
  featchAddress: async () => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.get(`${API_ROUTES.ADDRESS}/get-address`, {
        withCredentials: true,
      });

      set({ isLoading: false, addresses: response.data.address });
    } catch (error) {
      set({ isLoading: false, error: "Failed to fetch Address" });
    }
  },
  createAddress: async (address) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(
        `${API_ROUTES.ADDRESS}/add-address`,
        address,
        {
          withCredentials: true,
        }
      );

      const newAddress = response.data.address;
      set((state) => ({
        addresses: [newAddress, ...state.addresses],
        isLoading: false,
      }));

      return newAddress;
    } catch (error) {
      set({ isLoading: false, error: "Failed to Create Address" });
    }
  },
  updateAddress: async (id, address) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.put(
        `${API_ROUTES.ADDRESS}/update-address/${id}`,
        address,
        {
          withCredentials: true,
        }
      );

      const updatedAddress = response.data.address;
      set((state) => ({
        addresses: state.addresses.map((item) =>
          item.id === id ? updatedAddress : item
        ),
        isLoading: false,
      }));

      return updatedAddress;
    } catch (error) {
      set({ isLoading: false, error: "Failed to Create Address" });
    }
  },
  deleteAddress: async (id) => {
    set({ error: null, isLoading: true });
    try {
      await axios.delete(`${API_ROUTES.ADDRESS}/delete-address/${id}`, {
        withCredentials: true,
      });

      set((state) => ({
        addresses: state.addresses.filter((address) => address.id !== id),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({ isLoading: false, error: "Failed to Create Address" });
      return false;
    }
  },
}));
