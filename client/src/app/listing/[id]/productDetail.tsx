"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailSkeleton from "./productSkeleton";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

function ProductDetailsContent({ id }: { id: string }) {
  const [product, setProduct] = useState<any>(null);
  const { getProductById, isLoading } = useProductStore();
  const { addToCart, error } = useCartStore();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColors, setSelectedColors] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: product.colors[selectedColors],
        size: selectedSizes,
        quantity: quantity,
      });

      setSelectedColors(0);
      setSelectedSizes("");
      setQuantity(1);

      toast("Product added successfully to cart");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const productDetails = await getProductById(id);
      if (productDetails) {
        setProduct(productDetails);
      } else {
        router.push("/404");
      }
    };

    fetchProduct();
  }, [id, getProductById, router]);

  if (!product || isLoading) return <ProductDetailSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-2/3 flex gap-4">
            <div className="hidden lg:flex flex-col gap-2 w-24">
              {product.images.map((image: string, index: number) => (
                <button
                  onClick={() => setSelectedImage(index)}
                  key={index}
                  className={`${
                    selectedImage === index
                      ? "border-black"
                      : "border-transparent"
                  } border-2`}
                >
                  <img
                    src={image}
                    alt={`Product-${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 relative w-[300px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div>
                <span className="text-2xl font-semibold ">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedColors === index
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColors(index)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Sizes</h3>
              <div className="flex gap-2">
                {product.sizes.map((size: string, index: number) => (
                  <Button
                    key={index}
                    className={`w-12 h-12  `}
                    variant={selectedSizes === size ? "default" : "outline"}
                    onClick={() => setSelectedSizes(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Button
                className={"w-full bg-black text-white hover:bg-gray-800"}
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="details">Product Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">
                Shipping & Returns Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-5">
              <p className="text-gray-700 mb-4">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-5">
              <p className="text-gray-700 mb-4">Reviews</p>
            </TabsContent>
            <TabsContent value="shipping" className="mt-5">
              <p className="text-gray-700 mb-4"> Shipping & Returns Info</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsContent;
