"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductListingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Skeleton className="h-8 w-64 rounded-md bg-gray-200" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 rounded-lg bg-gray-200 lg:hidden" />
            <Skeleton className="h-10 w-40 rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="flex gap-10">
          {/* Product Cards Grid */}
          <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-md bg-white animate-pulse"
              >
                <Skeleton className="h-64 w-full bg-gray-200" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  <Skeleton className="h-6 w-1/3 bg-gray-200 mt-3" />
                  <Skeleton className="h-10 w-full bg-blue-200 rounded-md mt-4" />
                </div>
              </div>
            ))}
          </main>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-md bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
