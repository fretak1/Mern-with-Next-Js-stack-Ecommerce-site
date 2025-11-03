import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CheckoutContent from "./checkoutContent";
import { Card } from "@/components/ui/card";

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 animate-pulse">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Skeleton */}
            <Card className="p-6 shadow-md border border-gray-100 space-y-4">
              <Skeleton className="h-8 w-1/3 rounded-md" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />{" "}
                    <Skeleton className="h-3 w-1/3 rounded-md" />
                  </div>
                </div>
              ))}
              <Skeleton className="h-10 w-full rounded-md mt-2" />{" "}
            </Card>

            {/* Payment Section Skeleton */}
            <Card className="p-6 shadow-md border border-gray-100 space-y-4">
              <Skeleton className="h-8 w-1/3 rounded-md" />

              <Skeleton className="h-4 w-full rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full rounded-md" />

                <Skeleton className="h-10 w-36 rounded-md" />
              </div>
            </Card>
          </div>

          {/* Right Side - Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8 shadow-md border border-gray-100 space-y-4">
              <Skeleton className="h-8 w-1/3 rounded-md" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-12 w-12 rounded-md" />

                  <div className="flex-1 ml-4 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />

                    <Skeleton className="h-3 w-1/3 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
              ))}
              <Skeleton className="h-1 w-full rounded-md mt-2" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md mt-2" />{" "}
              <Skeleton className="h-6 w-full rounded-md mt-4" />{" "}
              <Skeleton className="h-6 w-full rounded-md mt-2" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutSuspense() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}

export default CheckoutSuspense;
