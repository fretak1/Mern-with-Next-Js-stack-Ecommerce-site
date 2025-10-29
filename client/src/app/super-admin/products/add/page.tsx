"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/store/useProductStore";
import {
  brands as brandsData,
  categories,
  colors,
  sizes,
} from "@/utils/conifg";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface FormState {
  name: string;
  brandCategory: string; // Category select
  brand: string; // Brand select/input
  description: string;
  category: string;
  gender: string;
  price: string;
  stock: string;
  productType: string;
}

function SuperAdminManageProductPage() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    brandCategory: "",
    brand: "",
    description: "",
    category: "",
    gender: "",
    price: "",
    stock: "",
    productType: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const getCurrentEditedProductId = searchParams.get("id");
  const isEditMode = !!getCurrentEditedProductId;

  const router = useRouter();
  const { createProduct, isLoading, updateProduct, getProductById } =
    useProductStore();

  useEffect(() => {});
  useEffect(() => {
    if (isEditMode) {
      getProductById(getCurrentEditedProductId).then((product) => {
        if (product) {
          setFormState({
            name: product.name,
            brandCategory: product.brandCategory, // optional reset
            brand: product.brand,
            description: product.description,
            category: product.category,
            gender: product.gender,
            price: product.price.toString(),
            stock: product.stock.toString(),
            productType: product.productType,
          });
          setSelectedSizes(product.sizes);
          setSelectedColors(product.colors);
        }
      });
    }
  }, [isEditMode, getCurrentEditedProductId, getProductById]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "brandCategory" ? { brand: "" } : {}),
    }));
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColors = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((s) => s !== color) : [...prev, color]
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formDataObj = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });
    formDataObj.append("sizes", selectedSizes.join(","));
    formDataObj.append("colors", selectedColors.join(","));

    if (!isEditMode) {
      selectedFiles.forEach((file) => {
        formDataObj.append("images", file);
      });
    }

    const result = isEditMode
      ? await updateProduct(getCurrentEditedProductId, formDataObj)
      : await createProduct(formDataObj);

    if (result) router.push("/super-admin/products/list");
  };

  const filteredBrands =
    brandsData.find((b) => b.title === formState.brandCategory)?.brands || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 rounded-xl shadow-lg">
      <div className="flex flex-col gap-6">
        <header className="pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
        </header>

        <form onSubmit={handleFormSubmit} className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Media & Description */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Media & Details
            </h2>

            {!isEditMode && (
              <div
                style={{
                  borderColor: "#2F80ED",
                  backgroundColor: "rgba(47, 128, 237, 0.05)",
                }}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 hover:border-primary transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Upload
                    style={{ color: "#2F80ED" }}
                    className="mx-auto h-12 w-12"
                  />
                  <div className="mt-4 flex text-sm font-medium leading-6 text-gray-600">
                    <Label
                      style={{ color: "#2F80ED" }}
                      className="cursor-pointer rounded-md font-semibold hover:opacity-80 transition-colors"
                    >
                      <span>Click to Browse</span>
                      <Input
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3 p-3 border-t border-gray-200 w-full justify-center">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative shadow-md rounded-md overflow-hidden"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`preview ${index + 1}`}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Product Description
              </Label>
              <Textarea
                name="description"
                style={{ borderColor: "#2F80ED" }}
                className="mt-2 min-h-[180px] border-gray-300 focus:border-2 focus:ring-0 transition-shadow"
                placeholder="Write a detailed product description here..."
                onChange={handleInputChange}
                value={formState.description}
              />
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Product Information
            </h2>

            {/* Name */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Product Name
              </Label>
              <Input
                type="text"
                name="name"
                placeholder="E.g., Leather Sneakers"
                style={{ borderColor: "#2F80ED" }}
                className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                onChange={handleInputChange}
                value={formState.name}
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Product Type
              </Label>
              <Select
                value={formState.productType}
                onValueChange={(value) =>
                  handleSelectChange("productType", value)
                }
              >
                <SelectTrigger
                  style={{ borderColor: "#2F80ED" }}
                  className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                >
                  <SelectValue placeholder="Select Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured Product</SelectItem>
                  <SelectItem value="new">New Arrival</SelectItem>
                  <SelectItem value="regular">Regular Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Brand Category */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Brand Category
              </Label>
              <Select
                value={formState.brandCategory}
                onValueChange={(value) =>
                  handleSelectChange("brandCategory", value)
                }
              >
                <SelectTrigger
                  style={{ borderColor: "#2F80ED" }}
                  className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                >
                  <SelectValue placeholder="Select Brand Category" />
                </SelectTrigger>
                <SelectContent>
                  {brandsData.map((b) => (
                    <SelectItem key={b.title} value={b.title}>
                      {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand (input for Beauty & Cosmotics) */}
            <div>
              {formState.brandCategory === "Beauty & Cosmotics" ? (
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Brand
                  </Label>
                  <Input
                    name="brand"
                    placeholder="Enter brand name"
                    value={formState.brand}
                    onChange={handleInputChange}
                    style={{ borderColor: "#2F80ED" }}
                    className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Brand
                  </Label>
                  <Select
                    value={formState.brand}
                    onValueChange={(value) =>
                      handleSelectChange("brand", value)
                    }
                    disabled={!formState.brandCategory}
                  >
                    <SelectTrigger
                      style={{ borderColor: "#2F80ED" }}
                      className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                    >
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBrands.map((b) => (
                        <SelectItem key={b.name} value={b.name}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Category & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Category
                </Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger
                    style={{ borderColor: "#2F80ED" }}
                    className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Gender
                </Label>
                <Select
                  value={formState.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger
                    style={{ borderColor: "#2F80ED" }}
                    className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                  >
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Price (ETB)
                </Label>
                <Input
                  name="price"
                  type="number"
                  style={{ borderColor: "#2F80ED" }}
                  className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                  placeholder="0.00"
                  value={formState.price}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">
                  Stock
                </Label>
                <Input
                  name="stock"
                  type="number"
                  style={{ borderColor: "#2F80ED" }}
                  className="mt-2 border-gray-300 focus:border-2 focus:ring-0"
                  placeholder="0"
                  value={formState.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Available Sizes
              </Label>
              <div className="mt-2 flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white">
                {sizes.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={selectedSizes.includes(s) ? "default" : "outline"}
                    onClick={() => handleToggleSize(s)}
                    className={
                      selectedSizes.includes(s)
                        ? "shadow-md hover:bg-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }
                    style={
                      selectedSizes.includes(s)
                        ? { backgroundColor: "#2F80ED", color: "white" }
                        : {}
                    }
                    size="sm"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Available Colors
              </Label>
              <div className="mt-2 flex flex-wrap gap-3 p-2 border border-gray-200 rounded-lg bg-white">
                {colors.map((color) => (
                  <Button
                    key={color.name}
                    type="button"
                    className={`h-8 w-8 rounded-full shadow-md ${color.class} ${
                      selectedColors.includes(color.name)
                        ? "ring-4 ring-offset-2 ring-offset-gray-100"
                        : "hover:ring-2 hover:ring-gray-300"
                    }`}
                    style={
                      selectedColors.includes(color.name)
                        ? { boxShadow: `0 0 0 3px #F2C94C, 0 0 0 6px #2F80ED` }
                        : {}
                    }
                    onClick={() => handleToggleColors(color.name)}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              disabled={isLoading}
              type="submit"
              style={{ backgroundColor: "#2F80ED" }}
              className="mt-6 w-full text-lg h-12 font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Product"
                : "Add New Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuperAdminManageProductPage;
