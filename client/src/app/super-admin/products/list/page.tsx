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
import { Pencil, Trash, PlusCircle, Package, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function SuperAdminProductListPage() {
  const { products, isLoading, fetchAllProductsForAdmin, deleteProduct } =
    useProductStore();

  const router = useRouter();
  const productFetchRef = useRef(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin]);

  const openDeleteModal = (productId: string) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const result = await deleteProduct(productToDelete);
      if (result) {
        toast.success("Product deleted successfully!");
        fetchAllProductsForAdmin();
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product.");
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          All Products
        </h1>
        <Button
          onClick={() => router.push("/super-admin/products/add")}
          className="bg-blue-500 hover:bg-blue-400 text-primary-foreground font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Product
        </Button>
      </header>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="ml-4 text-lg text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-lg bg-gray-50">
            <Package className="h-20 w-20 mb-4 text-gray-400" />
            <p className="font-semibold text-gray-800">No Products Found</p>
            <p className="text-sm text-gray-400">
              Get started by adding your first product.
            </p>
            <Button
              onClick={() => router.push("/super-admin/products/add")}
              className="mt-6 bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-5 rounded-md shadow-md flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Add New Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="py-4 pl-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">
                    Product Name
                  </TableHead>
                  <TableHead className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </TableHead>
                  <TableHead className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </TableHead>
                  <TableHead className="py-4 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </TableHead>
                  <TableHead className="py-4 pr-6 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={`Image of ${product.name}`}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-base">
                            {product.name}
                          </p>
                          {product.sizes && product.sizes.length > 0 && (
                            <p className="text-sm text-gray-500 mt-0.5">
                              Size: {product.sizes.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-4 text-base text-gray-800">
                      {product.price.toFixed(2)} ETB
                    </TableCell>

                    <TableCell className="py-4 px-4 text-base">
                      <p className="font-medium text-gray-800">
                        {product.stock} in Stock
                      </p>
                      {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-sm text-yellow-600">Low stock!</p>
                      )}
                      {product.stock === 0 && (
                        <p className="text-sm text-red-600">Out of stock</p>
                      )}
                    </TableCell>

                    <TableCell className="py-4 px-4 text-base">
                      <p className="font-medium text-gray-800">
                        {product.category.toUpperCase()}
                      </p>
                    </TableCell>

                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() =>
                            router.push(
                              `/super-admin/products/add?id=${product.id}`
                            )
                          }
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit Product"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button
                          onClick={() => openDeleteModal(product.id)}
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-100 hover:text-red-700"
                          title="Delete Product"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* --- Custom Delete Modal --- */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={closeDeleteModal}
                variant="outline"
                className="px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminProductListPage;
