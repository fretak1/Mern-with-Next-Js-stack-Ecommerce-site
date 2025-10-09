"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductStore } from "@/store/useProductStore";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function SuperAdminProductListPage() {
  const {
    products,
    isLoading,
    fetchAllProductsForAdmin,
    deleteProduct,
    getProductById,
  } = useProductStore();

  const router = useRouter();
  const productFetchRef = useRef(false);

  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin]);

  async function handleDeleteProduct(getId: string) {
    if (window.confirm("Are You sure You want to delete this Product ?")) {
      const result = await deleteProduct(getId);
      if (result) {
        toast("Product deleted Successfully");
        fetchAllProductsForAdmin();
      }
    }
  }

  if (isLoading) return;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>All Products</h1>
          <Button onClick={() => router.push("/super-admin/products/add")}>
            Add New Product
          </Button>
        </header>
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-1 bg-gray-100 overflow-hidden">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt="product image"
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Size: {product.sizes.join(",")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${product.price.toFixed()}</TableCell>
                    <TableCell>
                      <p>{product.stock} Item Left</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {product.category.toLocaleUpperCase()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() =>
                            router.push(
                              `/super-admin/products/add?id=${product.id}`
                            )
                          }
                          variant={"ghost"}
                          size={"icon"}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant={"ghost"}
                          size={"icon"}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminProductListPage;
