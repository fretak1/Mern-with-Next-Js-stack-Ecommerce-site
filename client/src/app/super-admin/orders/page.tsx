"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { toast } from "sonner"; // Assuming sonner is configured for toast messages
import { Loader2 } from "lucide-react"; // For loading indicator

function SuperAdminManageOrdersPage() {
  const { getAllOrders, adminOrders, updateOrderStatus, isLoading, error } =
    useOrderStore();

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  // Handle errors from the store
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"; // Added CANCELLED for completeness

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "outline"; // A default badge with border
      case "PROCESSING":
        return "default"; // Standard filled badge
      case "SHIPPED":
        return "secondary"; // A subtle, darker filled badge
      case "DELIVERED":
        return "success"; // Assuming you have a 'success' variant in your Badge component
      case "CANCELLED":
        return "destructive"; // Red for cancelled/error
      default:
        return "default";
    }
  };

  const getStatusBadgeColors = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "text-blue-700 bg-blue-50 border-blue-200"; // Light blue background, darker text, blue border
      case "PROCESSING":
        return "text-yellow-800 bg-yellow-100 border-yellow-300"; // Light yellow background, darker text, yellow border
      case "SHIPPED":
        return "text-purple-700 bg-purple-100 border-purple-300"; // Light purple background, darker text, purple border
      case "DELIVERED":
        return "text-green-700 bg-green-100 border-green-300"; // Light green background, darker text, green border
      case "CANCELLED":
        return "text-red-700 bg-red-100 border-red-300"; // Light red background, darker text, red border
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast.success("Order status updated successfully!"); // Use success toast
    }
    // Error case is handled by the useEffect for `error` state
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Orders List
          </h1>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
            <p className="ml-4 text-lg text-gray-600">Loading orders...</p>
          </div>
        ) : adminOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-lg">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.268 12.031A2.25 2.25 0 0118.674 22H5.326a2.25 2.25 0 01-2.24-2.008l1.268-12.031A2.25 2.25 0 015.326 8.25h13.348c1.121 0 2.078.602 2.516 1.559z"
              />
            </svg>
            <p className="font-semibold">No Orders Found</p>
            <p className="text-sm text-gray-400">
              There are no orders to display at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[120px] text-gray-700 font-semibold">
                    Order ID
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Created At
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Total
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Payment Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Items
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Order Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs text-gray-700">
                      #{order.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium">
                      {order.user.name}
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          order.paymentStatus === "COMPLETED"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {order.paymentStatus.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.items.length}{" "}
                      {order.items.length > 1 ? "items" : "item"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${getStatusBadgeColors(
                          order.status
                        )}`}
                      >
                        {order.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-[140px] h-9 text-sm border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PROCESSING">Processing</SelectItem>
                          <SelectItem value="SHIPPED">Shipped</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminManageOrdersPage;
