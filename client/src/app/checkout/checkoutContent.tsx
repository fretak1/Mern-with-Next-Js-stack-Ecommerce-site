"use client";

import { paymentAction } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddressStore } from "@/store/useAddressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { Coupon, useCouponStore } from "@/store/useCouponStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/useProductStore";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CheckoutContent() {
  const { addresses, featchAddress } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    (CartItem & { product: any })[]
  >([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponAppliedError, setCouponAppliedError] = useState("");
  const { user } = useAuthStore();
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const { items, fetchCart, clearCart } = useCartStore();
  const { getProductById } = useProductStore();

  const {
    createPayPalOrder,
    capturePayPalOrder,
    createOrder,
    isPaymentProcessing,
  } = useOrderStore();
  const { fetchCoupons, couponList } = useCouponStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCoupons();
      featchAddress();
      fetchCart();
    }
  }, [featchAddress, fetchCoupons, fetchCart]);

  useEffect(() => {
    const defaultAddress = addresses.find((a) => a.isDefault);
    if (defaultAddress) setSelectedAddress(defaultAddress.id);
  }, [addresses]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return { ...item, product };
        })
      );
      setCartItemsWithDetails(details);
    };
    fetchProductDetails();
  }, [items, getProductById]);

  function handleApplyCoupon() {
    const coupon = couponList.find((c) => c.code === couponCode);

    if (!coupon) {
      setCouponAppliedError("Invalid Coupon Code");
      setAppliedCoupon(null);
      return;
    }

    const now = new Date();
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      setCouponAppliedError("Coupon is not valid at this time");
      setAppliedCoupon(null);
      return;
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      setCouponAppliedError("Coupon usage limit reached");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponAppliedError("");
  }

  const handlePrePaymentFlow = async () => {
    const result = await paymentAction(checkoutEmail);
    if (!result.success) {
      toast(result.error);
      return;
    }
    setShowPaymentFlow(true);
  };

  const handleFinalOrderCreation = async (data: any) => {
    if (!user) return toast("User not authenticated");

    try {
      const orderData = {
        userId: user.id,
        addressId: selectedAddress,
        items: cartItemsWithDetails.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productCategory: item.product.category,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
        couponId: appliedCoupon?.id,
        total,
        paymentMethod: "CREDIT_CARD" as const,
        paymentStatus: "COMPLETED" as const,
        paymentId: data.id,
      };

      const response = await createOrder(orderData);
      if (response) {
        await clearCart();
        router.push("/account");
      } else toast("There was an issue processing your order.");
    } catch (error) {
      console.error(error);
      toast("Error while processing final order.");
    }
  };

  const subTotal = cartItemsWithDetails.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const discount = appliedCoupon
    ? (subTotal * appliedCoupon.discountPercent) / 100
    : 0;
  const total = subTotal - discount;

  if (isPaymentProcessing) {
    return (
      <Skeleton className="w-full h-[600px] rounded-xl flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Processing Payment... Please Wait
        </h1>
      </Skeleton>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery */}
            <Card className="p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Delivery Address
              </h2>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-3 rounded-lg border transition ${
                      selectedAddress === address.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={address.id}
                        checked={selectedAddress === address.id}
                        onCheckedChange={() => setSelectedAddress(address.id)}
                      />
                      <Label
                        htmlFor={address.id}
                        className="flex-grow cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {address.name}
                          </span>
                          {address.isDefault && (
                            <span className="text-sm text-green-600">
                              (Default)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">
                          {address.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.country} -{" "}
                          {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </Label>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => router.push("/account")}
                  className="bg-blue-500 hover:bg-blue-400 text-white w-full transition-all duration-200 shadow-sm"
                >
                  Add Another Address
                </Button>
              </div>
            </Card>

            {/* Payment Section */}
            <Card className="p-6 shadow-md border border-gray-100">
              {showPaymentFlow ? (
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Payment
                  </h3>
                  <p className="mb-3 text-gray-600">
                    All transactions are secure and encrypted.
                  </p>
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "silver",
                      shape: "rect",
                      label: "pay",
                    }}
                    fundingSource="card"
                    createOrder={async () => {
                      const orderId = await createPayPalOrder(
                        cartItemsWithDetails,
                        total
                      );
                      if (!orderId)
                        throw new Error("Failed to create PayPal order");
                      return orderId;
                    }}
                    onApprove={async (data) => {
                      const captureData = await capturePayPalOrder(
                        data.orderID
                      );
                      if (captureData)
                        await handleFinalOrderCreation(captureData);
                      else alert("Failed to capture PayPal order");
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Enter Your Email to Continue
                  </h3>
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                    />
                    <Button
                      onClick={handlePrePaymentFlow}
                      className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-200"
                    >
                      Proceed to Buy
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-4">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                      <img
                        src={item?.product?.images[0]}
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-gray-700">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-3">
                  <Input
                    placeholder="Enter discount or gift code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white transition-all duration-200"
                  >
                    Apply
                  </Button>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600">
                      Coupon Applied Successfully
                    </p>
                  )}
                  {couponAppliedError && (
                    <p className="text-sm text-red-600">{couponAppliedError}</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
