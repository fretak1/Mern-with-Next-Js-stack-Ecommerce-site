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
import { Pencil, Trash, PlusCircle, Package } from "lucide-react"; // Added PlusCircle and Package icons
import Image from "next/image";
import { useRouter } from "next/navigation"; // Removed useSearchParams as it's not used
import { useEffect, useRef } from "react"; // Removed useState as it's not used
import { toast } from "sonner";

function SuperAdminProductListPage() {
  const {
    products,
    isLoading,
    fetchAllProductsForAdmin,
    deleteProduct,
    // getProductById, // Not used in this component, can be removed if not needed elsewhere
  } = useProductStore();

  const router = useRouter();
  const productFetchRef = useRef(false); // Used to prevent double-fetching on re-renders in dev mode

  useEffect(() => {
    // Only fetch products once on mount
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin]);

  async function handleDeleteProduct(productId: string) {
    // Use sonner's built-in confirmation or a custom dialog for better UX
    // For now, sticking to window.confirm as per original, but improved message.
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (confirmed) {
      try {
        const result = await deleteProduct(productId);
        if (result) {
          toast.success("Product deleted successfully!"); // Using toast.success
          fetchAllProductsForAdmin(); // Re-fetch to update the list
        } else {
          toast.error("Failed to delete product."); // Using toast.error
        }
      } catch (error) {
        toast.error("An error occurred while deleting the product.");
        console.error("Error deleting product:", error);
      }
    }
  }

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen-minus-navbar">
        {" "}
        {/* Assumed a utility class for full height */}
        <div className="flex items-center space-x-2 text-xl text-gray-600">
          <svg
            className="animate-spin h-6 w-6 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.062 0 014 12c0-3.042 1.135-5.824 3-7.938l1 .731c-1.636 2.053-2.5 4.542-2.5 7.207 0 2.665.864 5.154 2.5 7.207l-1 .73z"
            ></path>
          </svg>
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

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
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50">
            <Package className="mx-auto h-20 w-20 text-gray-400 mb-6" />
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-md text-gray-500">
              Get started by adding your first product.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => router.push("/super-admin/products/add")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-5 rounded-md shadow-md transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Product
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="py-4 pl-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[200px] rounded-tl-xl">
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
                  <TableHead className="py-4 pr-6 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-xl">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={`Image of ${product.name}`}
                              width={56} // Tailwind w-14 * 4
                              height={56} // Tailwind h-14 * 4
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
                      ${product.price.toFixed(2)}
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
                          className="text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                          title="Edit Product"
                        >
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
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
    </div>
  );
}

export default SuperAdminProductListPage;
