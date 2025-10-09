"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function SuperAdminManageCouponsPage() {
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
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

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Create New Coupon</h1>
        </header>
        <form action="" className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          <div className="space-y-4">
            <div>
              <Label>Start Date</Label>
              <Input
                value={formData.startDate}
                onChange={handleInputChange}
                type="date"
                name="StartDate"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                value={formData.endDate}
                onChange={handleInputChange}
                type="date"
                name="endDate"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label>Coupon Code</Label>
              <div className="flex justify-between items-center gap-2">
                <Input
                  type="text"
                  name="code"
                  placeholder="Enter coupon code"
                  className="mt-1.5"
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                />
                <Button type="button" onClick={handleCreateUniqueCoupon}>
                  Create Unique Code
                </Button>
              </div>
            </div>
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                name="discountPercent"
                placeholder="Enter Discount Percentage"
                className="mt-1.5"
                value={formData.discountPercent}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Usage Limits</Label>
              <Input
                type="number"
                name="usageLimit"
                placeholder="Enter Usage Limits"
                className="mt-1.5"
                value={formData.usageLimit}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuperAdminManageCouponsPage;
