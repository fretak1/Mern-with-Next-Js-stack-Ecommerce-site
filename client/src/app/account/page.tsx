"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Address, useAddressStore } from "@/store/useAddressStore";
import { useOrderStore, Order } from "@/store/useOrderStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialAddressFormState = {
  name: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  phone: "",
  isDefault: false,
};

type AddressFormData = {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
};


export default function UserAccountPage() {
  const {
    addresses,
    isLoading: addressesLoading,
    createAddress,
    deleteAddress,
    updateAddress,
    featchAddress,
  } = useAddressStore();
  const {
    getOrdersByUserId,
    userOrders,
    isLoading: ordersLoading,
  } = useOrderStore();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialAddressFormState);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    featchAddress();
    getOrdersByUserId();
  }, [featchAddress, getOrdersByUserId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle address form submission (create/update)
  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingAddress) {
        const result = await updateAddress(editingAddress, formData);
        if (result) toast.success("Address Updated Successfully");
      } else {
        const result = await createAddress(formData);
        if (result) toast.success("Address Created Successfully");
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      setFormData(initialAddressFormState);
      featchAddress();
    } catch (error) {
      toast.error("Failed to save address.");
      console.error("Error saving address:", error);
    }
  };

  // Set form data for editing an address
  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddress(address.id);
    setShowAddressForm(true);
  };

  // Handle address deletion
  const handleDeleteAddress = async (id: string) => {
    setAddressToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      const success = await deleteAddress(addressToDelete);
      if (success) {
        toast.success("Address Deleted Successfully");
        featchAddress();
      } else {
        toast.error("Failed to delete address.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting address.");
      console.error("Error deleting address:", error);
    } finally {
      closeDeleteModal();
    }
  };

  // Helper function for order status badge styling
  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (ordersLoading || addressesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-blue-500 border-r-blue-200 rounded-full animate-spin"></div>
        <p className="mt-6 text-lg md:text-xl font-medium text-gray-700 animate-pulse">
          Loading your account details...
        </p>
      </div>
    );
  }

  return (
    <div className="container bg-gray-50 mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center tracking-tight">
        My Account
      </h1>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto rounded-xl shadow-md bg-white p-1 mb-8">
          <TabsTrigger
            value="orders"
            className="text-lg font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground rounded-lg transition-all"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="text-lg font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground rounded-lg transition-all"
          >
            Addresses
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab Content */}
        <TabsContent value="orders">
          <Card className="shadow-lg rounded-xl border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Order History
              </CardTitle>
              <CardDescription className="text-gray-600">
                View your past orders and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg mb-4">
                    You haven&apos;t placed any orders yet.
                  </p>
                  <Button
                    variant="outline"
                    className="text-primary border-primary hover:bg-primary/5"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                          Order #
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-100">
                      {userOrders.map((order: Order) => (
                        <TableRow
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {order.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge
                              className={`${getStatusVariant(
                                order.status
                              )} px-3 py-1 text-xs font-semibold rounded-full border`}
                            >
                              {order.status.charAt(0) +
                                order.status.slice(1).toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                            {order.total.toFixed(2)} ETB
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab Content */}
        <TabsContent value="addresses">
          <Card className="shadow-lg rounded-xl border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Saved Addresses
              </CardTitle>
              <CardDescription className="text-gray-600">
                Add, edit, or remove your shipping addresses.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {showAddressForm ? (
                <form
                  onSubmit={handleAddressSubmit}
                  className="space-y-6 p-6 bg-white rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "name",
                      "address",
                      "city",
                      "country",
                      "postalCode",
                      "phone",
                    ].map((field) => (
                      <div key={field} className="space-y-2">
                        <Label
                          htmlFor={field}
                          className="text-gray-700 font-medium"
                        >
                          {field.charAt(0).toUpperCase() +
                            field
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")
                              .trim()}{" "}
                        </Label>
                        <Input
                          id={field}
                          value={formData[field as keyof AddressFormData]}
                          required
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-primary focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isDefault: checked as boolean,
                        })
                      }
                      className="border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Label htmlFor="isDefault" className="text-gray-700">
                      Set as default address
                    </Label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md font-semibold transition-colors"
                    >
                      {editingAddress ? "Update Address" : "Add Address"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                        setFormData(initialAddressFormState);
                      }}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-semibold transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  {addresses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg mb-6">
                      <p className="text-gray-500 text-lg mb-4">
                        You haven&apos;t added any addresses yet.
                      </p>
                      <Button
                        onClick={() => {
                          setEditingAddress(null);
                          setFormData(initialAddressFormState);
                          setShowAddressForm(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {addresses.map((address) => (
                        <Card
                          key={address.id}
                          className="shadow-sm hover:shadow-md rounded-xl p-6 border border-gray-200 transition-all duration-200 flex flex-col justify-between"
                        >
                          <CardContent className="p-0">
                            <p className="font-bold text-lg text-gray-800 mb-1">
                              {address.name}
                            </p>
                            <p className="text-gray-600">{address.address}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.country}{" "}
                              {address.postalCode}
                            </p>
                            <p className="text-gray-600">
                              Tel: {address.phone}
                            </p>
                            {address.isDefault && (
                              <Badge className="mt-3 bg-blue-500 text-white font-semibold text-xs px-3 py-1 rounded-full border-blue-600">
                                Default Address
                              </Badge>
                            )}
                          </CardContent>
                          <div className="flex gap-2 mt-5">
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                              onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="flex-1 font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                            >
                              Delete
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() => {
                          setEditingAddress(null);
                          setFormData(initialAddressFormState);
                          setShowAddressForm(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-md font-semibold text-base shadow-md transition-colors"
                      >
                        Add New Address
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={closeDeleteModal}
                variant="outline"
                className="px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
