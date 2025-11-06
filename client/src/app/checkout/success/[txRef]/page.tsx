"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SuccessPageProps {
  params: Promise<{ txRef: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function CheckoutSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const router = useRouter();
  const { finalizeChapaOrder, error: orderError } = useOrderStore();
  const { clearCart } = useCartStore();

  const [paymentStatus, setPaymentStatus] = useState<
    "VERIFYING" | "SUCCESS" | "FAILED"
  >("VERIFYING");

  const { txRef } = React.use(params);
  const resolvedSearchParams = React.use(searchParams);

  useEffect(() => {
    const handleFinalization = async () => {
      if (!txRef) {
        setPaymentStatus("FAILED");
        toast.error("Missing transaction reference.");
        return;
      }

      const success = await finalizeChapaOrder(txRef);

      if (success) {
        setPaymentStatus("SUCCESS");
        clearCart();
        toast.success("Payment successful! Your order is confirmed.");
      } else {
        setPaymentStatus("FAILED");
        toast.error(
          orderError || "Payment failed or could not be verified by the server."
        );
      }
    };

    handleFinalization();
  }, [txRef, searchParams, finalizeChapaOrder, orderError, clearCart]);

  const renderContent = () => {
    switch (paymentStatus) {
      case "VERIFYING":
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-800">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">Please do not close.</p>
          </div>
        );
      case "SUCCESS":
        return (
          <div className="flex flex-col items-center space-y-6">
            <CheckCircle className="w-16 h-16 text-blue-500" />
            <h1 className="text-3xl font-bold text-blue-500">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-center">
              Your order is confirmed and will be processed shortly.
            </p>
            <Button
              onClick={() => router.push("/account")}
              className="bg-blue-500 hover:bg-blue-400"
            >
              View Your Order
            </Button>
          </div>
        );
      case "FAILED":
        return (
          <div className="flex flex-col items-center space-y-6">
            <XCircle className="w-16 h-16 text-red-500" />
            <h1 className="text-3xl font-bold text-red-700">Payment Failed</h1>
            <p className="text-gray-600 text-center">
              There was an issue processing your payment or verifying the
              transaction.
            </p>
            {orderError && (
              <Card className="p-3 bg-red-50 border border-red-200 w-full max-w-sm">
                <p className="text-sm font-medium text-red-700">
                  Error: {orderError}
                </p>
              </Card>
            )}
            <Button onClick={() => router.push("/checkout")} variant="outline">
              Try Checkout Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 p-6">
      <Card className="p-10 shadow-xl border border-gray-100 w-full max-w-lg">
        {renderContent()}
      </Card>
    </div>
  );
}
