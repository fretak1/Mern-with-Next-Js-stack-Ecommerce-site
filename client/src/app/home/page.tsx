"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProductStore } from "@/store/useProductStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { motion } from "framer-motion";
import {
  HandbagIcon,
  WatchIcon,
  FlaskConical,
  Sparkles,
  Footprints,
  Handbag,
  Shirt,
  ShoppingBasket,
  Images,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const categoriesWithIcon = [
  { id: "handBags", label: "Hand Bags", icon: HandbagIcon },
  { id: "travelGymBags", label: "Travel & Gym Bags", icon: HandbagIcon },
  { id: "laptopBags", label: "Laptop Bags", icon: HandbagIcon },
  { id: "watches", label: "Watches", icon: WatchIcon },
  { id: "perfumes", label: "Perfumes", icon: FlaskConical },
  { id: "Beauty & Cosmotics", label: "Beauty & Cosmotics", icon: Sparkles },
];

// Custom Arrows
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -left-5 top-1/2 transform -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full shadow-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
    aria-label="Previous"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -right-5 top-1/2 transform -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full shadow-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
    aria-label="Next"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
);

// Slider Config for Brand Sections
const brandSliderSettings = (count: number) => ({
  dots: false,
  infinite: count > 5,
  speed: 600,
  slidesToShow: Math.min(count, 5),
  slidesToScroll: 1,
  autoplay: count > 5,
  autoplaySpeed: 3500,
  arrows: count > 5,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: Math.min(count, 3) } },
    { breakpoint: 768, settings: { slidesToShow: Math.min(count, 2) } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
});

// Animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function HomePage() {
  const { banners, featchBanners } = useSettingsStore();
  const { products, getAllProducts } = useProductStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const isSlider = products.length > 4;

  useEffect(() => {
    featchBanners();
    getAllProducts();
  }, [featchBanners, getAllProducts]);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  // Brand Sections Data
  const brandSections = [
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
  ];

  const handleCategoryClick = (category: string) => {
    router.push(`/listing?category=${encodeURIComponent(category)}`);
  };

  // Navigate to listing page filtered by brand
  const handleBrandClick = (brand: string) => {
    router.push(`/listing?brand=${encodeURIComponent(brand)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* HERO SLIDER SECTION */}
      <section className="relative h-[80vh] overflow-hidden shadow-lg">
        {banners.map((bannerItem, index) => (
          <div
            key={bannerItem.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={bannerItem.imageUrl}
              alt={`banner ${index + 1}`}
              className="w-full h-full object-cover brightness-[.75]"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-6 container mx-auto text-white">
              <div className="space-y-4 max-w-xl">
                <span className="text-sm uppercase tracking-[.25em] font-medium opacity-80 border-l-4 border-white pl-3">
                  Ethio Market
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  LUXURY BAGS, PERFUMES,
                  <br />
                  WATCHES & COSMETICS
                </h1>
                <p className="text-lg opacity-90 font-light max-w-md">
                  Discover elegance and style at Ethio Market — your destination
                  for premium fragrances, designer bags, timeless watches, and
                  high-end beauty products.
                </p>
                <Button
                  onClick={() => router.push("/listing")}
                  className="bg-white text-gray-900 font-semibold hover:bg-gray-200 transition-all px-10 py-7 text-lg rounded-full shadow-xl uppercase mt-4"
                >
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
            />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-gray-800">
              Featured Products
            </h2>
            <Button
              asChild
              className="!bg-blue-500 hover:!bg-blue-400 text-white transition-colors"
            >
              <Link href="/listing" className="block px-6 py-2">
                View All
              </Link>
            </Button>
          </div>

          <div className="group relative">
            {isSlider ? (
              <Slider
                dots={false}
                infinite={true}
                speed={600}
                slidesToShow={4}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3500}
                arrows={true}
                prevArrow={<PrevArrow />}
                nextArrow={<NextArrow />}
                responsive={[
                  { breakpoint: 1024, settings: { slidesToShow: 3 } },
                  { breakpoint: 768, settings: { slidesToShow: 2 } },
                  { breakpoint: 480, settings: { slidesToShow: 1 } },
                ]}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="px-3"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl bg-white transition-shadow duration-300 cursor-pointer">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-headline text-lg font-medium leading-tight">
                          <Link
                            href={`/products/${product.id}`}
                            className="hover:text-blue-500 transition-colors"
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.category}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xl font-semibold text-gray-900">
                            ${product.price.toFixed(2)}
                          </p>
                          <div className="flex items-center text-blue-500 gap-0.5">
                            {[...Array(4)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5"
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => router.push(`/listing/${product.id}`)}
                          className="bg-blue-500 w-full hover:!bg-blue-400 mt-5"
                        >
                          Add To Cart
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Slider>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl bg-white transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-headline text-lg font-medium leading-tight">
                        <Link
                          href={`/products/${product.id}`}
                          className="hover:text-blue-500 transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.category}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xl font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center text-blue-500 gap-0.5">
                          {[...Array(4)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5"
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push(`/listing/${product.id}`)}
                        className="bg-blue-500 w-full hover:!bg-blue-400 mt-5"
                      >
                        Add To Cart
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl mb-10 md:text-4xl font-bold text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesWithIcon.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCategoryClick(item.label)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="w-12 h-12 mb-4 text-blue-500" />
                  <span>{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY BRAND SECTION WITH SLIDER */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <header className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Shop by Brand
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Discover the world’s most iconic brands known for luxury,
              craftsmanship, and timeless design.
            </p>
          </header>

          {brandSections.map((section) => (
            <div key={section.title} className="mb-20">
              <h3
                className={`text-2xl md:text-3xl font-semibold text-gray-800 mb-8 border-l-4 border-${section.color}-500 pl-4`}
              >
                {section.title}
              </h3>

              <Slider {...brandSliderSettings(section.brands.length)}>
                {section.brands.map((brand) => (
                  <motion.div
                    key={brand.name}
                    variants={cardVariants}
                    className="px-3"
                  >
                    <Card
                      className="relative rounded-2xl overflow-hidden border
                     border-gray-200 hover:border-transparent hover:shadow-2xl
                      hover:-translate-y-2 transition-all duration-300 bg-white
                       group cursor-pointer"
                      onClick={() => handleBrandClick(brand.name)}
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
                  </motion.div>
                ))}
              </Slider>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
