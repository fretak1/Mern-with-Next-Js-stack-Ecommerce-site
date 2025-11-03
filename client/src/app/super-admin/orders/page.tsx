"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/useOrderStore";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function SuperAdminManageOrdersPage() {
  const { getAllOrders, adminOrders, updateOrderStatus, isLoading, error } =
    useOrderStore();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  const getStatusBadgeColors = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "PROCESSING":
        return "text-yellow-800 bg-yellow-100 border-yellow-300";
      case "SHIPPED":
        return "text-purple-700 bg-purple-100 border-purple-300";
      case "DELIVERED":
        return "text-green-700 bg-green-100 border-green-300";
      case "CANCELLED":
        return "text-red-700 bg-red-100 border-red-300";
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
      toast.success("Order status updated successfully!");
      getAllOrders();
      setIsDialogOpen(false);
    }
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsDialogOpen(true);
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
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
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
            <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-[70px] text-center text-gray-700 font-semibold uppercase tracking-wide">
                    #
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold uppercase tracking-wide">
                    Created At
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold uppercase tracking-wide">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold uppercase tracking-wide text-center">
                    Total
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold uppercase tracking-wide text-center">
                    Payment
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold uppercase tracking-wide text-center">
                    Items
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold uppercase tracking-wide text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold uppercase tracking-wide text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {adminOrders.map((order, index) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors border-t"
                  >
                    <TableCell className="text-center font-medium text-gray-700">
                      {index + 1}
                    </TableCell>

                    <TableCell className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-gray-800 font-medium">
                      {order.user.name}
                    </TableCell>

                    <TableCell className="text-right text-gray-800 font-semibold">
                      {order.total.toFixed(2)} ETB
                    </TableCell>

                    <TableCell className="text-center">
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

                    <TableCell className="text-center text-gray-700 text-sm">
                      {order.items.length}{" "}
                      <span className="text-gray-500">
                        {order.items.length > 1 ? "items" : "item"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${getStatusBadgeColors(
                          order.status
                        )}`}
                      >
                        {order.status.toLowerCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        className="text-sm hover:bg-green-50 hover:text-green-700 border-gray-200 transition-all"
                        onClick={() => openOrderDetails(order)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/*  Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!max-w-[50vw] !max-h-[95vh] w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-blue-500 mb-4">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-800">
                    {selectedOrder.user.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-semibold text-blue-500">
                    ${selectedOrder.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <Badge
                    className={`uppercase font-medium ${
                      selectedOrder.paymentStatus === "COMPLETED"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <Badge
                    className={`capitalize ${getStatusBadgeColors(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status.toLowerCase()}
                  </Badge>
                </div>
              </div>

              {/*  Address Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Shipping Address
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b pb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium text-gray-800">City:</span>{" "}
                    {selectedOrder.address?.city || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">
                      Postal Code:
                    </span>{" "}
                    {selectedOrder.address?.postalCode || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Phone:</span>{" "}
                    {selectedOrder.address?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/*  Items Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Items
                </h3>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <ul className="space-y-2">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <li
                        key={i}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>
                          {item.quantity}{" "}
                          {item.productName || "Unnamed Product"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/*  Status Change */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Change Order Status
                </h3>
                <Select
                  value={newStatus}
                  onValueChange={(val) => setNewStatus(val)}
                >
                  <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <DialogFooter className=" flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="px-5 py-2 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Close
            </Button>
            <Button
              onClick={() =>
                handleStatusUpdate(selectedOrder.id, newStatus as OrderStatus)
              }
              disabled={newStatus === selectedOrder?.status}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SuperAdminManageOrdersPage;
