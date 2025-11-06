import { Suspense } from 'react';
// Assuming the client component above is now in ProductListingContent.tsx
import ProductListingSkeleton from "@/components/user/productListingSkeleton"; // Re-using your existing skeleton
import ProductListingContent from './listingContent';

// This Server Component's job is to wrap the client component in Suspense
// The Suspense fallback is what the server renders immediately
export default function ProductListingPage() {
  return (
    <Suspense fallback={<ProductListingSkeleton />}>
      <ProductListingContent />
    </Suspense>
  );
}
