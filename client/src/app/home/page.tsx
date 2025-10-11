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
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1974&auto=format&fit=crop",
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
    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  console.log(banners, featuredProducts, "yessssssss");
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[600px] overflow-hidden">
        {banners.map((bannerItem, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-100 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            key={bannerItem.id}
          >
            <div className="absolute inset-0">
              <img
                src={bannerItem.imageUrl}
                alt={`banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-full  container mx-auto px-4  flex items-center">
              <div className=" text-white space-y-6">
                <span className="text-sm uppercase tracking-wider">
                  I AM FREZER
                </span>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  BEST SELLING
                  <br />
                  E-COMMERCE WEBSITE
                </h1>
                <p className="text-lg">
                  A Creative, Flexible , Clean, Easy to use and
                  <br />
                  High Performance E-Commerce Theme
                </p>
                <Button className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg">
                  SHOP NOW
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Grid Section*/}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold mb-2">
            THE WINTER EDIT
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Designed to keep your satisfaction and warmth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gridItems.map((Item, index) => (
              <div key={index} className="relative group overflow-hidden">
                <div className="aspect-[3/4]">
                  <img
                    src={Item.image}
                    alt={Item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-x font-semibold mb-2">{Item.title}</h3>
                    <p className="text-sm">{Item.subtitle}</p>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                      SHOP NOW
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* feature product Section*/}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold mb-2">
            NEW ARRIVALS
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Shop our new arrivals from established brands
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, index) => (
              <div key={index} className="relative group overflow-hidden">
                <div className="aspect-[3/4]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-x font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm">{product.price}</p>
                    <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                      QUICK VIEW
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
