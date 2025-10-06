"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductStore } from "@/store/useProductStore";
import { useEffect } from "react";

function SuperAdminProductListPage() {
  const { products, fetchAllProductsForAdmin } = useProductStore();

  useEffect(() => {
    fetchAllProductsForAdmin();
  }, [fetchAllProductsForAdmin]);

  console.log("products", products);
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>All Products</h1>
          <Button>Add New Product</Button>
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
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminProductListPage;
