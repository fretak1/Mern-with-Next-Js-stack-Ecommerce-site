import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CheckoutContent from "./checkoutContent";

function CheckoutSkeleton() {
  return (
    <div>
      <Skeleton />
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
