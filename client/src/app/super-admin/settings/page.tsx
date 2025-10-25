"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useProductStore } from "@/store/useProductStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function SuperAdminSettingPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { products, fetchAllProductsForAdmin } = useProductStore();
  const {
    featuredProducts,
    banners,
    isLoading, // This isLoading is for the entire settings store operations
    error,
    featchBanners,
    featchFeaturedProducts,
    addBanners,
    updateFeaturedProducts,
  } = useSettingsStore();

  const [isSavingBanners, setIsSavingBanners] = useState(false);
  const [isSavingFeaturedProducts, setIsSavingFeaturedProducts] =
    useState(false);

  const pageLoadRef = useRef(false);

  useEffect(() => {
    if (!pageLoadRef.current) {
      featchBanners();
      fetchAllProductsForAdmin();
      featchFeaturedProducts();
      pageLoadRef.current = true;
    }
  }, [fetchAllProductsForAdmin, featchFeaturedProducts, featchBanners]);

  // Handle errors from the store
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const removeImage = (getCurrentIndex: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== getCurrentIndex));
  };

  const handleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }

      if (prev.length >= 8) {
        toast.info("You can select up to 8 products as featured");
        return prev;
      }

      return [...prev, productId];
    });
  };

  const handleSaveChanges = async () => {
    // Handle banner upload
    if (uploadedFiles.length > 0) {
      setIsSavingBanners(true);
      const result = await addBanners(uploadedFiles);
      if (result) {
        toast.success("Banners updated successfully!");
        setUploadedFiles([]);
        featchBanners();
      } else {
        toast.error("Failed to upload banners.");
      }
      setIsSavingBanners(false);
    }

    // Handle featured products update
    setIsSavingFeaturedProducts(true);
    const result = await updateFeaturedProducts(selectedProducts);
    if (result) {
      toast.success("Featured products updated successfully!");
      featchFeaturedProducts();
    } else {
      toast.error("Failed to update featured products.");
    }
    setIsSavingFeaturedProducts(false);
  };

  useEffect(() => {
    if (featuredProducts.length > 0 && selectedProducts.length === 0) {
      setSelectedProducts(featuredProducts.map((pro) => pro.id));
    }
  }, [featuredProducts, selectedProducts.length]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 lg:p-10">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Settings & Features
          </h1>
        </header>

        <div className="space-y-10">
          {/* Banner Images Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Home Page Banners
            </h2>
            <div className="space-y-4">
              <Label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full min-h-[120px] p-6 transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ease-in-out duration-200"
              >
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  <Upload className="h-8 w-8 text-gray-500" />
                  <span className="text-sm font-medium">
                    Drag & Drop or{" "}
                    <span className="text-primary-600 hover:underline">
                      Click to upload
                    </span>{" "}
                    banners
                  </span>
                  <span className="text-xs text-gray-400">
                    (Max 5 images recommended for carousel)
                  </span>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </Label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  New Banners to Upload:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative group w-full h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded banner ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="default" // Reverted to default variant for consistency, but kept color classes
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full h-7 w-7 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {banners.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Current Banners:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className="relative group w-full h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <img
                        src={banner.imageUrl}
                        alt={`Existing banner ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Featured Products Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Featured Products
            </h2>
            <p className="text-gray-600 mb-4">
              Select up to 8 products to feature on the client home page.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  className={`relative p-5 border rounded-lg transition-all duration-200 ${
                    selectedProducts.includes(product.id)
                      ? "border-blue-500 bg-blue-50 shadow-md" // Blue border and light blue background for selected
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                  key={product.id}
                >
                  <div className="absolute top-3 right-3">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductSelection(product.id)}
                      className="h-5 w-5 border-gray-400
                        data-[state=checked]:bg-blue-500          
                        data-[state=checked]:border-blue-500
                        data-[state=checked]:text-white" // Make checkbox blue when checked
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="font-bold text-xl text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8">
            <Button
              disabled={
                isLoading || isSavingBanners || isSavingFeaturedProducts
              }
              onClick={handleSaveChanges}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md font-semibold text-base shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {(isLoading || isSavingBanners || isSavingFeaturedProducts) && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              {isSavingBanners
                ? "Uploading Banners..."
                : isSavingFeaturedProducts
                ? "Updating Featured Products..."
                : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminSettingPage;
