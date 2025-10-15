"use client";

import { Suspense, use } from "react";
import ProductDetailSkeleton from "./productSkeleton";
import ProductDetailsContent from "./productDetail";

function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailsContent id={id} />
    </Suspense>
  );
}

export default ProductDetailsPage;
