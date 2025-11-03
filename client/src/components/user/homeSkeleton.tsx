"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full bg-gray-200 rounded-md overflow-hidden mb-10">
        <div className="absolute inset-0 flex flex-col justify-center items-start px-6 container mx-auto">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-10 w-2/3 mb-3" />
          <Skeleton className="h-8 w-1/2 mb-3" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </section>

      <div className="container mx-auto px-6 space-y-20">
        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col"
              >
                <Skeleton className="h-64 w-full mb-4 rounded-md" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col"
              >
                <Skeleton className="h-64 w-full mb-4 rounded-md" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <Skeleton className="h-8 w-56 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center"
              >
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </section>

        {/* Brands */}
        <section>
          <Skeleton className="h-10 w-64 mb-10 mx-auto" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white h-40 rounded-lg shadow-sm flex items-center justify-center"
              >
                <Skeleton className="h-20 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
