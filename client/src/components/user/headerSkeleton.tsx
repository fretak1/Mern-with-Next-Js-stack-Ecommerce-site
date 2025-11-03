"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gray-50/70 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-md bg-blue-200" />
            <Skeleton className="h-6 w-32 rounded-md bg-blue-200" />
          </div>

          {/* Desktop Nav (hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-8">
            <Skeleton className="h-5 w-16 bg-gray-200 rounded-md" />
            <Skeleton className="h-5 w-20 bg-gray-200 rounded-md" />
            <Skeleton className="h-5 w-24 bg-gray-200 rounded-md" />
          </div>

          {/* Search Bar Placeholder */}
          <div className="hidden lg:flex items-center space-x-3">
            <Skeleton className="h-10 w-80 rounded-full bg-gray-200" />
            <Skeleton className="h-10 w-24 rounded-lg bg-blue-200" />
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center space-x-8">
            <Skeleton className="h-9 w-28 rounded-md bg-gray-200" />
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </header>
  );
}
