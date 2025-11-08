"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useProductStore } from "@/store/useProductStore";
import { brands as brandsData, categories, colors, sizes } from "@/utils/conifg";

interface FormState {
  name: string;
  brandCategory: string;
  brand: string;
  description: string;
  category: string;
  gender: string;
  price: string;
  stock: string;
  productType: string;
}

export default function ManageProductContent() {
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
  const productId = searchParams?.get("id") || "";
  const isEditMode = Boolean(productId);

  const router = useRouter();
  const { createProduct, isLoading, updateProduct, getProductById } = useProductStore();

  useEffect(() => {
    if (!isEditMode) return;

    (async () => {
      const product = await getProductById(productId);
      if (product) {
        setFormState({
          name: product.name,
          brandCategory: product.brandCategory,
          brand: product.brand,
          description: product.description,
          category: product.category,
          gender: product.gender,
          price: product.price.toString(),
          stock: product.stock.toString(),
          productType: product.productType,
        });
        setSelectedSizes(product.sizes || []);
        setSelectedColors(product.colors || []);
      }
    })();
  }, [isEditMode, productId, getProductById]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleToggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => formData.append(key, value));
    formData.append("sizes", selectedSizes.join(","));
    formData.append("colors", selectedColors.join(","));

    if (!isEditMode) {
      selectedFiles.forEach((file) => formData.append("images", file));
    }

    const success = isEditMode
      ? await updateProduct(productId, formData)
      : await createProduct(formData);

    if (success) {
      toast.success(isEditMode ? "Product updated!" : "Product added!");
      router.push("/super-admin/products/list");
    } else {
      toast.error("Something went wrong. Try again!");
    }
  };

  const filteredBrands =
    brandsData.find((b) => b.title === formState.brandCategory)?.brands || [];

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleFormSubmit} className="grid lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {!isEditMode && (
            <div className="border-2 border-dashed border-blue-400 bg-blue-50 p-8 rounded-lg text-center">
              <Upload className="mx-auto h-10 w-10 text-blue-500" />
              <Label className="block mt-3 text-blue-600 cursor-pointer font-semibold">
                Click to upload images
                <Input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded overflow-hidden shadow-sm">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <Label>Product Description</Label>
            <Textarea
              name="description"
              placeholder="Write a detailed description..."
              value={formState.description}
              onChange={handleInputChange}
              className="mt-2 border-blue-400 focus:border-blue-500"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          <div>
            <Label>Product Name</Label>
            <Input
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              placeholder="Leather Sneakers"
              className="mt-2 border-blue-400 focus:border-blue-500"
            />
          </div>

          <div>
            <Label>Product Type</Label>
            <Select
              value={formState.productType}
              onValueChange={(v) => handleSelectChange("productType", v)}
            >
              <SelectTrigger className="mt-2 border-blue-400">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Brand Category</Label>
            <Select
              value={formState.brandCategory}
              onValueChange={(v) => handleSelectChange("brandCategory", v)}
            >
              <SelectTrigger className="mt-2 border-blue-400">
                <SelectValue placeholder="Select Category" />
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

          {formState.brandCategory === "Beauty & Cosmotics" ? (
            <div>
              <Label>Brand</Label>
              <Input
                name="brand"
                placeholder="Enter brand"
                value={formState.brand}
                onChange={handleInputChange}
                className="mt-2 border-blue-400"
              />
            </div>
          ) : (
            <div>
              <Label>Brand</Label>
              <Select
                value={formState.brand}
                onValueChange={(v) => handleSelectChange("brand", v)}
              >
                <SelectTrigger className="mt-2 border-blue-400">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={formState.category}
                onValueChange={(v) => handleSelectChange("category", v)}
              >
                <SelectTrigger className="mt-2 border-blue-400">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                value={formState.gender}
                onValueChange={(v) => handleSelectChange("gender", v)}
              >
                <SelectTrigger className="mt-2 border-blue-400">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (ETB)</Label>
              <Input
                name="price"
                type="number"
                value={formState.price}
                onChange={handleInputChange}
                className="mt-2 border-blue-400"
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                name="stock"
                type="number"
                value={formState.stock}
                onChange={handleInputChange}
                className="mt-2 border-blue-400"
              />
            </div>
          </div>

          <div>
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={selectedSizes.includes(s) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Colors</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleToggleColor(color.name)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    selectedColors.includes(color.name)
                      ? "ring-4 ring-blue-400"
                      : "hover:ring-2"
                  } ${color.class}`}
                />
              ))}
            </div>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
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
  );
}
