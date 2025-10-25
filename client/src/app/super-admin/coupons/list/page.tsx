"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash, Loader2 } from "lucide-react"; // Import Loader2
import { toast } from "sonner"; // Assuming sonner is configured for toast messages

function SuperAdminCouponListPage() {
  const router = useRouter();
  const { isLoading, couponList, fetchCoupons, deleteCoupon } =
    useCouponStore();
  const fetchCouponRef = useRef(false);

  useEffect(() => {
    if (!fetchCouponRef.current) {
      fetchCouponRef.current = true;
      fetchCoupons();
    }
  }, [fetchCoupons]);

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this Coupon?")) {
      const result = await deleteCoupon(id);

      if (result) {
        toast.success("Coupon Deleted Successfully"); // Changed to toast.success
        fetchCoupons(); // Re-fetch to update the list
      } else {
        toast.error("Failed to delete coupon."); // Added error toast
      }
    }
  };

  // Helper for status badge colors (similar to orders page)
  const getCouponStatusBadgeColors = (isActive: boolean) => {
    return isActive
      ? "text-green-700 bg-green-100 border-green-300" // Active (Green)
      : "text-red-700 bg-red-100 border-red-300"; // Expired (Red)
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            All Coupons
          </h1>
          <Button
            onClick={() => router.push("/super-admin/coupons/add")}
            className="bg-blue-500 hover:bg-blue-400 text-primary-foreground py-2 px-4 rounded-md font-semibold transition-colors"
          >
            Add New Coupon
          </Button>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
            <p className="ml-4 text-lg text-gray-600">Loading coupons...</p>
          </div>
        ) : couponList.length === 0 ? (
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
            <p className="font-semibold">No Coupons Found</p>
            <p className="text-sm text-gray-400">
              There are no coupons to display at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[120px] text-gray-700 font-semibold">
                    Code
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Discount
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Usage
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Start Date
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    End Date
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {couponList.map((coupon) => {
                  const isActive = new Date(coupon.endDate) > new Date();
                  return (
                    <TableRow key={coupon.id} className="hover:bg-gray-50">
                      <TableCell className="font-semibold text-gray-800">
                        {coupon.code}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-800">
                        {coupon.discountPercent}%
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {coupon.usageCount}/{coupon.usageLimit}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(coupon.startDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(coupon.endDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${getCouponStatusBadgeColors(
                            isActive
                          )}`}
                        >
                          {isActive ? "active" : "expired"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          variant="destructive" // Use destructive variant for delete
                          size={"icon"}
                          className="h-8 w-8" // Make it a bit larger for better clickability
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminCouponListPage;
