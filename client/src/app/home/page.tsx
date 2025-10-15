"use client";

import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect, useState } from "react";

const gridItems = [
  {
    title: "WOMEN",
    subtitle: "From world's top designer",
    image:
      "https://images.unsplash.com/photo-1614251056216-f748f76cd228?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "FALL LEGENDS",
    subtitle: "Timeless cool weather",
    image:
      "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter1_600x.png?v=1733380268",
  },
  {
    title: "ACCESSORIES",
    subtitle: "Everything you need",
    image:
      "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter4_600x.png?v=1733380275",
  },
  {
    title: "HOLIDAY SPARKLE EDIT",
    subtitle: "Party season ready",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1974&auto=format&fit-crop",
  },
];

function HomePage() {
  const { banners, featchBanners, featuredProducts, featchFeaturedProducts } =
    useSettingsStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    featchBanners();
    featchFeaturedProducts();
  }, [featchBanners, featchFeaturedProducts]);

  useEffect(() => {
    // Necessary comment: Prevents setInterval from running on an empty array
    if (banners.length > 0) {
      const bannerTimer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(bannerTimer);
    }
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* ==================================================
        HERO SLIDER SECTION
        ==================================================
      */}
      <section className="relative h-[80vh] min-h-[550px] overflow-hidden shadow-lg">
        {banners.map((bannerItem, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            key={bannerItem.id}
          >
            <div className="absolute inset-0">
              <img
                src={bannerItem.imageUrl}
                alt={`banner ${index + 1}`}
                className="w-full h-full object-cover brightness-[.75]"
              />
            </div>
            <div className="relative h-full container mx-auto px-6 flex flex-col justify-center">
              <div className="text-white space-y-4 md:space-y-6 max-w-xl p-4 md:p-6 bg-black/10 backdrop-blur-sm rounded-lg">
                <span className="text-sm md:text-md uppercase tracking-[.25em] font-medium opacity-80 border-l-4 border-white pl-3">
                  I AM FREZER
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight">
                  BEST SELLING
                  <br />
                  E-COMMERCE WEBSITE
                </h1>
                <p className="text-lg opacity-90 font-light max-w-md">
                  A Creative, Flexible, Clean, Easy to use, and High Performance
                  E-Commerce Theme.
                </p>
                <Button className="bg-white text-gray-900 font-semibold hover:bg-gray-200 transition-colors duration-200 px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl uppercase tracking-wider mt-4">
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ring-2 ring-white ${
                currentSlide === index
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ==================================================
        CATEGORY GRID SECTION
        ==================================================
      */}

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              THE WINTER EDIT
            </h2>
            <p className="text-lg text-gray-500 mt-2 font-light">
              Designed to keep your satisfaction and warmth
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {gridItems.map((Item, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="aspect-[3/4] bg-gray-100">
                  <img
                    src={Item.image}
                    alt={Item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white transition-opacity duration-300">
                  <h3 className="text-xl font-bold leading-snug">
                    {Item.title}
                  </h3>
                  <p className="text-sm opacity-90">{Item.subtitle}</p>
                </div>

                <div className="absolute inset-0 bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-6">
                    <h3 className="text-2xl font-bold mb-2 uppercase tracking-wider">
                      {Item.title}
                    </h3>
                    <p className="text-md mb-4 text-gray-300">
                      {Item.subtitle}
                    </p>
                    <Button className="bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors px-6 py-3 rounded-full shadow-lg">
                      EXPLORE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
        FEATURED PRODUCTS SECTION
        ==================================================
      */}

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              NEW ARRIVALS
            </h2>
            <p className="text-lg text-gray-500 mt-2 font-light">
              Shop our new arrivals from established brands
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-white text-gray-900 font-medium hover:bg-gray-100 px-6 py-3 rounded-full shadow-xl">
                      QUICK VIEW
                    </Button>
                  </div>
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-md font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  {/* Necessary comment: Assuming product.price is a number */}
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {`$${product.price}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="px-10 py-4 text-lg font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors duration-300 rounded-full shadow-lg hover:shadow-xl uppercase tracking-wider">
              VIEW ALL PRODUCTS
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
