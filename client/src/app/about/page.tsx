"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-400 to-blue-500 text-white py-20 px-6 sm:px-10 lg:px-20 rounded-b-3xl">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
            Welcome to Ethio Market
          </h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            Your one-stop online marketplace for the best products from across
            Ethiopia. Quality, convenience, and trust at your fingertips.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 sm:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded with the goal of making online shopping seamless and
              enjoyable, Ethio Market brings together a wide variety of products
              from trusted vendors. Our mission is to connect people with the
              items they love, while providing a safe, fast, and secure shopping
              experience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              From everyday essentials to exclusive local products, we strive to
              offer the best value and convenience for all our customers.
            </p>
          </div>
          <div>
            <img
              src="/images/listingBanner.png"
              alt="Our Story"
              className="rounded-xl shadow-lg w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 px-6 sm:px-10 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Our Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                Mission
              </h3>
              <p className="text-gray-700">
                To provide a seamless, reliable, and enjoyable online shopping
                experience while supporting local businesses and products across
                Ethiopia.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                Vision
              </h3>
              <p className="text-gray-700">
                To become the leading online commerce platform in Ethiopia,
                empowering customers and vendors with trust, convenience, and
                innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Quality
              </h3>
              <p className="text-gray-700">
                We only partner with trusted vendors to ensure high-quality
                products for our customers.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Trust
              </h3>
              <p className="text-gray-700">
                Your safety and satisfaction are our top priorities in every
                transaction.
              </p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Innovation
              </h3>
              <p className="text-gray-700">
                We leverage technology to make shopping faster, easier, and
                smarter for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 sm:px-10 lg:px-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Start Shopping Today
        </h2>
        <p className="text-gray-700 mb-8">
          Discover amazing products and enjoy a seamless online shopping
          experience.
        </p>
<Link
  href="/listing"
  className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
>
  Explore Our Store
</Link>
      </section>
    </div>
  );
}
