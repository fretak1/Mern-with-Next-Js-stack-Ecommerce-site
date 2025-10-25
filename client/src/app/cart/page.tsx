"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

function UserCartPage() {
  const { fetchCart, items, isLoading, updateCartQuantity, removeFromCart } =
    useCartStore();
  const { user } = useAuthStore();
  const [isUpdating, setIsupdating] = useState(false);
  const router = useRouter();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemoveItem = async (id: string) => {
    setIsupdating(true);
    await removeFromCart(id);
    setIsupdating(false);
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    setIsupdating(true);
    await updateCartQuantity(id, Math.max(1, newQuantity));
    setIsupdating(false);
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [fetchCart]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 flex items-center justify-center gap-2">
          <ShoppingBag className="w-8 h-8 text-blue-500" />
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-6">
              Your cart is currently empty.
            </p>
            <Button
              onClick={() => router.push("/listing")}
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg shadow"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto bg-white shadow-md rounded-xl">
              <Table className="w-full">
                <TableHeader className="bg-gray-100 text-gray-700">
                  <TableRow>
                    <TableHead className="text-left py-4 px-6 font-semibold">
                      Product
                    </TableHead>
                    <TableHead className="text-right py-4 px-6 font-semibold">
                      Price
                    </TableHead>
                    <TableHead className="text-center py-4 px-6 font-semibold">
                      Quantity
                    </TableHead>
                    <TableHead className="text-right py-4 px-6 font-semibold">
                      Total
                    </TableHead>
                    <TableHead className="text-right py-4 px-6 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <TableCell className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="object-cover w-16 h-16 rounded-md border"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Color: {item.color} | Size: {item.size}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-6 px-6 text-right text-gray-700 font-medium">
                        ${item.price}
                      </TableCell>

                      <TableCell className="py-6 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            variant="outline"
                            size="icon"
                            disabled={isUpdating}
                            className="rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <Input
                            type="number"
                            className="w-16 text-center"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value)
                              )
                            }
                          />

                          <Button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            variant="outline"
                            size="icon"
                            disabled={isUpdating}
                            className="rounded-full"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="py-6 px-6 text-right font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>

                      <TableCell className="py-6 px-6 text-right">
                        <Button
                          onClick={() => handleRemoveItem(item.id)}
                          variant="destructive"
                          size="sm"
                          disabled={isUpdating}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* ======= CART SUMMARY ======= */}
            <div className="mt-10 flex justify-end">
              <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-5">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-700 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 font-medium rounded-lg shadow"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    onClick={() => router.push("/listing")}
                    className="w-full border-gray-300 hover:bg-gray-100"
                    variant="outline"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserCartPage;
