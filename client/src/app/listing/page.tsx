"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProductStore } from "@/store/useProductStore";
import { brands, categories, colors, sizes } from "@/utils/conifg";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ProductListingPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category");
  const initialBrand = searchParams.get("brand");
  const productType = searchParams.get("type") || "";

  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  const {
    products,
    currentPage,
    totalPages,
    setCurrentPage,
    getFilteredProducts,
    isLoading,
    error,
  } = useProductStore();

  const fetchAllProducts = () => {
    getFilteredProducts({
      page: currentPage,
      limit: 6,
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      sortOrder,
      search: searchQuery,
      type: productType,
    });
  };

  useEffect(() => {
    fetchAllProducts();
  }, [
    currentPage,
    selectedCategories,
    selectedSizes,
    selectedBrands,
    selectedColors,
    priceRange,
    sortBy,
    sortOrder,
    searchQuery,
  ]);

  const handleToggleFilter = (
    filterType: "categories" | "sizes" | "brands" | "colors",
    value: string
  ) => {
    const setterMap = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    };
    setterMap[filterType]((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const FilterSection = () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-semibold text-lg text-gray-800">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() =>
                  handleToggleFilter("categories", category)
                }
                id={category}
              />
              <Label htmlFor={category} className="ml-2 text-sm text-gray-700">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-lg text-gray-800">Brands</h3>
        <div className="space-y-2">
          {brands.map((brandCategory) =>
            brandCategory.brands.map((b) => (
              <div key={b.name} className="flex items-center">
                <Checkbox
                  checked={selectedBrands.includes(b.name)}
                  onCheckedChange={() => handleToggleFilter("brands", b.name)}
                  id={b.name}
                />
                <Label htmlFor={b.name} className="ml-2 text-sm text-gray-700">
                  {b.name}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-lg text-gray-800">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((sizeItem) => (
            <Button
              key={sizeItem}
              variant={selectedSizes.includes(sizeItem) ? "default" : "outline"}
              onClick={() => handleToggleFilter("sizes", sizeItem)}
              className="h-8 w-8 text-sm rounded-full"
              size="sm"
            >
              {sizeItem}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-lg text-gray-800">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`w-7 h-7 rounded-full ${color.class} ${
                selectedColors.includes(color.name)
                  ? "ring-2 ring-offset-2 ring-gray-700"
                  : "hover:ring-2 hover:ring-gray-300"
              } transition-all duration-200`}
              title={color.name}
              onClick={() => handleToggleFilter("colors", color.name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-lg text-gray-800">
          Price Range
        </h3>
        <Slider
          defaultValue={[0, 100000]}
          max={100000}
          step={500}
          className="w-full"
          value={priceRange}
          onValueChange={(value) => setPriceRange(value)}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  console.log(products.length, "ddddddd");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-h-[600px] overflow-auto max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Filters
                  </DialogTitle>
                </DialogHeader>
                <FilterSection />
              </DialogContent>
            </Dialog>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={handleSortChange}
              name="sort"
            >
              <SelectTrigger className="mt-1.5 w-[180px]">
                <SelectValue placeholder="Sort Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-asc">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 bg-white border rounded-xl shadow-sm p-6">
            <FilterSection />
          </aside>

          {/* Product Cards */}
          <main className="flex-1">
            {isLoading ? (
              <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl bg-white transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.stock < 10 && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          Only {product.stock} left!
                        </span>
                      )}
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
                        <p className="text-xl font-semibold text-gray-900">
                          {product.price.toFixed(0)} ETB
                        </p>
                        <div className="flex items-center gap-2 ">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.round(product.rating || 0)
                                  ? "text-blue-500 fill-blue-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600">
                            {product.rating
                              ? `(${product.rating.toFixed(1)})`
                              : ""}
                          </span>
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
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <Button
                disabled={currentPage === 1}
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className="w-10"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                disabled={currentPage === totalPages}
                variant="outline"
                size="icon"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
