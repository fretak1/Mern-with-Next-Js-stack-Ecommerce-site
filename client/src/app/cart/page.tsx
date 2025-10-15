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
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

function UserCartPage() {
  const { fetchCart, items, isLoading, updateCartQuantity, removeFromCart } =
    useCartStore();
  const { user } = useAuthStore();
  const [isUpdating, setIsupdating] = useState(false);

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
    fetchCart();
  }, [fetchCart]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-left py-4 px-4">Product</TableHead>
                <TableHead className="text-right py-4 px-4">Price</TableHead>
                <TableHead className="text-center py-4 px-4">
                  Quantity
                </TableHead>
                <TableHead className="text-right py-4 px-4">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-t">
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover w-12 h-12"
                      />
                      <h3>{item.name}</h3>
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <Button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm text-white hover:text-white mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-4 text-right">
                    ${item.price}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        variant={"outline"}
                        size={"icon"}
                        disabled={isUpdating}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        className="w-16  text-center"
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
                        variant={"outline"}
                        size={"icon"}
                        disabled={isUpdating}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-4 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 flex justify-end">
          <div className="space-y-4">
            <div className="flex justify-between items-center ">
              <span className="font-medium">Total</span>
              <span className="font-bold ml-4">${total}</span>
            </div>
            <Button className="w-full bg-black text-white">
              Procced To Checkout
            </Button>
            <Button className="w-full " variant={"outline"}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCartPage;
