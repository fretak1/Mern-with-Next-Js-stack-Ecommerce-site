"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function SuperAdminManageCouponsPage() {
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
  });
  const router = useRouter();
  const { createCoupon, isLoading } = useCouponStore();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value, // Handle number conversion
    }));
  };

  const handleCreateUniqueCoupon = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setFormData((prev) => ({
      ...prev,
      code: result,
    }));
  };

  const handleCouponSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after Start Date"); // Using toast.error
      return;
    }

    if (formData.discountPercent <= 0) {
      toast.error("Discount percentage must be greater than 0.");
      return;
    }

    if (formData.usageLimit <= 0) {
      toast.error("Usage limit must be greater than 0.");
      return;
    }

    const couponData = {
      ...formData,
      discountPercent: parseFloat(formData.discountPercent.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
    };

    const result = await createCoupon(couponData);
    if (result) {
      toast.success("Coupon Added Successfully");
      router.push("/super-admin/coupons/list");
    } else {
      toast.error("Failed to create coupon. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Create New Coupon
          </h1>
        </header>
        <form
          onSubmit={handleCouponSubmit}
          className="max-w-xl mx-auto space-y-6"
        >
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="startDate"
                className="text-gray-700 font-medium mb-1.5 block"
              >
                Start Date
              </Label>
              <Input
                id="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                type="date"
                name="startDate"
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="endDate"
                className="text-gray-700 font-medium mb-1.5 block"
              >
                End Date
              </Label>
              <Input
                id="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                type="date"
                name="endDate"
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="code"
                className="text-gray-700 font-medium mb-1.5 block"
              >
                Coupon Code
              </Label>
              <div className="flex gap-3">
                <Input
                  id="code"
                  type="text"
                  name="code"
                  placeholder="Enter coupon code"
                  className="flex-1 border-gray-300 focus:border-primary focus:ring-primary"
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                />
                <Button
                  type="button"
                  onClick={handleCreateUniqueCoupon}
                  variant="outline"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                >
                  Create Unique Code
                </Button>
              </div>
            </div>
            <div>
              <Label
                htmlFor="discountPercent"
                className="text-gray-700 font-medium mb-1.5 block"
              >
                Discount Percentage
              </Label>
              <Input
                id="discountPercent"
                type="number"
                name="discountPercent"
                placeholder="e.g., 10 for 10%"
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
                value={formData.discountPercent}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <div>
              <Label
                htmlFor="usageLimit"
                className="text-gray-700 font-medium mb-1.5 block"
              >
                Usage Limit
              </Label>
              <Input
                id="usageLimit"
                type="number"
                name="usageLimit"
                placeholder="e.g., 100"
                className="w-full border-gray-300 focus:border-primary focus:ring-primary"
                value={formData.usageLimit}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-400 text-primary-foreground py-2.5 px-4 rounded-md font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isLoading ? "Creating..." : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuperAdminManageCouponsPage;
