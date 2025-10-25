"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/useProductStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  BabyIcon,
  Bandage,
  ChevronLeft,
  ChevronRight,
  CloudLightning,
  Dumbbell,
  Footprints,
  Handbag,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  HandbagIcon,
  FlaskConical,
  Sparkles,
  Heart,
} from "lucide-react";
import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const catagoriesWithIcon = [
  { id: "handBags", label: "Hand Bags", icon: HandbagIcon },
  { id: "travelGymBags", label: "Travel & Gym Bags", icon: HandbagIcon },
  { id: "laptopBags", label: "Laptop Bags", icon: HandbagIcon },
  { id: "watch", label: "Watches", icon: WatchIcon },
  { id: "perfumes", label: "Perfumes", icon: FlaskConical },
  { id: "cosmotics", label: "Cosmotics", icon: Sparkles },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Footprints },
  { id: "adidas", label: "Adidas", icon: Handbag },
  { id: "puma", label: "Puma", icon: Shirt },
  { id: "reebok", label: "Reebok", icon: ShoppingBasket },
  { id: "under-armour", label: "Under Armour", icon: Images },
];

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
  const { banners, featchBanners } = useSettingsStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, getAllProducts } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    featchBanners();
    getAllProducts();
  }, [featchBanners, getAllProducts]);

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
      <section className="relative h-[80vh] min-h-[50px] overflow-hidden shadow-lg">
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
            <div className="relative h-40  container mx-auto px-6 flex flex-col justify-center">
              <div
                className="text-white mt-85 space-y-4 md:space-y-6 max-w-xl p-4 md:p-6 text-shadow: 0 2px 4px rgba(0,0,0,0.6);
 rounded-lg"
              >
                <span className="text-sm md:text-md uppercase tracking-[.25em] font-medium opacity-80 border-l-4 border-white pl-3">
                  Ethio Market
                </span>
                <h1 className="text-sm sm:text-5xl lg:text-5xl font-extrabold leading-tight">
                  LUXURY BAGS, PERFUMES,
                  <br />
                  WATCHES & COSMETICS
                </h1>
                <p className="text-lg opacity-90 font-light max-w-md">
                  Discover elegance and style at Ethio Market — your destination
                  for premium fragrances, designer bags, timeless watches, and
                  high-end beauty products.
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

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Featured Products
            </h2>
            <Button
              asChild
              variant="default" // better than 'outline' for solid bg
              className="!bg-blue-500 hover:!bg-blue-400 text-white transition-colors"
            >
              <Link href="/listing" className="block px-6 py-2">
                View All
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl bg-white transition-shadow duration-300 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-headline text-lg font-medium leading-tight">
                    <Link
                      href={`/products/${product.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-semibold text-foreground">
                      ${product.price.toFixed(2)}
                    </p>

                    <div className="flex items-center text-blue-500 gap-0.5">
                      <Star className="h-5 w-5 " fill="currentColor" />
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => router.push(`/listing/${product.id}`)}
                      className="bg-blue-500 w-full hover:!bg-blue-400 mt-5"
                    >
                      Add To Cart
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

      <section className="pb-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-lg text-gray-500 mt-2 font-light">
              Shop our new arrivals from established brands
            </p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
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
                    <Button className="bg-blue-500 text-white font-medium hover:!bg-blue-400 px-6 py-3 rounded-full shadow-xl">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by catagory
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {catagoriesWithIcon.map((categoryItem) => (
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={categoryItem.id}
              >
                <CardContent className="flex items-center flex-col justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-blue-500" />
                  <span>{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
  SHOP BY BRAND SECTION
  ================================================== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          {/* ======== HEADER ======== */}
          <header className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
              Shop by Brand
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Discover the world’s most iconic brands known for luxury,
              craftsmanship, and timeless design.
            </p>
          </header>

          {/* ======== REUSABLE SECTION COMPONENT IDEA ======== */}
          {[
            {
              title: "Watch Brands",
              color: "blue",
              brands: [
                { name: "Rolex", logo: "/brands/rolex.png" },
                { name: "G-Shock", logo: "/brands/gshock.png" },
                { name: "Fossil", logo: "/brands/fossil.png" },
                { name: "Patek Philippe", logo: "/brands/patek.png" },
                { name: "Tissot", logo: "/brands/tissot.png" },
                { name: "Calvin Klein", logo: "/brands/calvin.png" },
                { name: "Smart Watch", logo: "/brands/smartwatch.png" },
              ],
            },
            {
              title: "Bag Brands",
              color: "pink",
              brands: [
                { name: "Gucci", logo: "/brands/gucci.png" },
                { name: "R & B", logo: "/brands/rnb.png" },
                { name: "Mont Blanc", logo: "/brands/montblanc.png" },
                { name: "Louis Vuitton", logo: "/brands/louisvuitton.png" },
                { name: "Charles & Keith", logo: "/brands/charleskeith.png" },
                { name: "Jimmy Choo", logo: "/brands/jimmychoo.png" },
                { name: "Chanel", logo: "/brands/chanelB.png" },
              ],
            },
            {
              title: "Perfume Brands",
              color: "purple",
              brands: [
                { name: "Valentino", logo: "/brands/valentino.png" },
                { name: "Chanel", logo: "/brands/chanel.png" },
                { name: "Giorgio Armani", logo: "/brands/armani.png" },
                { name: "Gucci", logo: "/brands/pgucci.png" },
                { name: "Dior", logo: "/brands/dior.png" },
                { name: "Hugo Boss", logo: "/brands/hugoboss.png" },
                { name: "Creed", logo: "/brands/creed.png" },
                { name: "Spice Bomb", logo: "/brands/spicebomb.png" },
                { name: "Emporio Armani", logo: "/brands/emporioarmani.png" },
                { name: "Tom Ford", logo: "/brands/tomford.png" },
                { name: "Lattafa", logo: "/brands/lattafa.png" },
              ],
            },
          ].map((section) => (
            <div key={section.title} className="mb-20">
              <h3
                className={`text-2xl md:text-3xl font-semibold text-gray-800 mb-8 border-l-4 border-${section.color}-500 pl-4`}
              >
                {section.title}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {section.brands.map((brand) => (
                  <Card
                    key={brand.name}
                    className="relative rounded-2xl overflow-hidden border border-gray-200 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white group cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-center bg-contain bg-no-repeat opacity-90 group-hover:opacity-80 transition-all duration-300"
                      style={{
                        backgroundImage: `url(${brand.logo})`,
                        backgroundSize: "150%",
                      }}
                    />
                    <CardContent className="relative flex flex-col items-center justify-end p-6 z-10 h-48 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-white text-lg md:text-xl font-semibold drop-shadow-md">
                        {brand.name}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
