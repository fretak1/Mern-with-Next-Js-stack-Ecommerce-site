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
import { icons, Trash } from "lucide-react";
import { toast } from "sonner";

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
    if (window.confirm("Are You sure You want to delete this Coupon ?")) {
      const result = await deleteCoupon(id);

      if (result) {
        toast("Coupon Deleted Successfully");
        fetchCoupons();
      }
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>All Coupons</h1>
          <Button onClick={() => router.push("/super-admin/coupons/add")}>
            Add New Coupons
          </Button>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponList.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <p className="font-semibold">{coupon.code}</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{coupon.discountPercent}%</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">
                    {coupon.usageCount}/{coupon.usageLimit}
                  </p>
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.startDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.endDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <Badge>
                    {new Date(coupon.endDate) > new Date()
                      ? "active"
                      : "Expired"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    variant="ghost"
                    size={"icon"}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SuperAdminCouponListPage;
