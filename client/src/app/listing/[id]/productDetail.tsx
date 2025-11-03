"use client";

import { Button } from "@/components/ui/button";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailSkeleton from "./productSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface Review {
  userId: string;
  rating: number;
  comment?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  images: string[];
  colors: string[];
  sizes: string[];
  category: string;
  description: string;
  rating?: number;
  reviews: Review[];
}

function ProductDetailsContent({ id }: { id: string }) {
  const [product, setProduct] = useState<Product >(null);
  const {
    getProductById,
    isLoading,
    products,
    addReview,
    fetchAllProductsForAdmin,
  } = useProductStore();
  const { addToCart } = useCartStore();
  const router = useRouter();
  const { user } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<{
    rating: number;
    comment: string;
  } | null>(null);

  useEffect(() => {
    if (product && user) {
      const existingReview = product.reviews.find(
        (r: Review) => r.userId === user.id
      );
      if (existingReview) {
        setUserReview({
          rating: existingReview.rating,
          comment: existingReview.comment || "",
        });
        setRating(existingReview.rating);
        setComment(existingReview.comment || "");
      } else {
        setUserReview(null);
        setRating(0);
        setComment("");
      }
    }
  }, [product, user]);

  useEffect(() => {
    const fetchProduct = async () => {
      const productDetails = await getProductById(id);
      if (productDetails) setProduct(productDetails);
      else router.push("/404");
    };
    fetchProduct();
  }, [id, getProductById, router]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) return router.push("/auth/login");

    const addToCartResult = await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[selectedColor],
      size: selectedSize,
      quantity,
    });

    if (addToCartResult) {
      setSelectedColor(0);
      setSelectedSize("");
      setQuantity(1);
      toast.success("Product added  to cart");
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) return router.push("/auth/login");

    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    if (!product) return;

    setIsSubmitting(true);
    try {
      const result = await addReview(product.id, { rating, comment });

      if (result?.success) {
        toast.success(result.message);

        const updatedProduct = await getProductById(id);
        if (!updatedProduct) {
          toast.error("Failed to fetch updated product.");
          return;
        }

        setProduct(updatedProduct);

        const updatedReview = updatedProduct.reviews.find(
          (r) => r.userId === user.id
        );

        if (updatedReview) {
          setUserReview({
            rating: updatedReview.rating,
            comment: updatedReview.comment || "",
          });

          setRating(updatedReview.rating);
          setComment(updatedReview.comment || "");
        }
      } else {
        toast.error(result?.message || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sameOtherProducts = product
    ? products.filter(
        (p) => p.category === product.category && p.id !== product.id
      )
    : [];

  if (!product || isLoading) return <ProductDetailSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        {/* ================= PRODUCT DETAILS ================= */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex flex-col-reverse lg:flex-row gap-6 lg:w-2/3">
            <div className="flex lg:flex-col gap-3 overflow-x-auto">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-md overflow-hidden transition-all duration-300 ${
                    selectedImage === index
                      ? "border-blue-500 scale-105"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product-${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 relative bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              {product.stock < 10 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xl font-semibold px-2 py-1 rounded">
                  Only {product.stock} left!
                </span>
              )}
            </div>
          </div>

          {/* === PRODUCT INFO SECTION === */}
          <div className="lg:w-1/3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {product.name}
              </h1>
              <p className="text-gray-500 text-sm mb-4">{product.brand}</p>

              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating || 0)
                        ? "text-blue-500 fill-blue-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600">
                  {product.rating ? product.rating.toFixed(1) : "No rating yet"}
                </span>
              </div>
              <span className="text-3xl font-semibold text-blue-600">
                {product.price.toFixed(2)} ETB
              </span>
            </div>

            {/* === COLORS === */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">Color</h3>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${
                      selectedColor === index
                        ? "ring-2 ring-offset-2 ring-blue-500 border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-800">Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="w-12 h-12 font-medium rounded-md"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-800">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                  className="w-10 h-10 rounded-md"
                >
                  −
                </Button>
                <span className="text-lg font-semibold w-10 text-center">
                  {quantity}
                </span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                  className="w-10 h-10 rounded-md"
                >
                  +
                </Button>
              </div>
            </div>

            <div>
              <Button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-500 w-full py-6 text-lg font-semibold tracking-wide rounded-xl shadow-md transition-all"
              >
                Add To Cart
              </Button>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full mt-10 border-t border-gray-200 pt-4"
            >
              <AccordionItem value="desc">
                <AccordionTrigger className="font-semibold text-gray-900 hover:text-blue-600">
                  Product Description
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {product.description}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ship">
                <AccordionTrigger className="font-semibold text-gray-900 hover:text-blue-600">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed space-y-3">
                  <p>
                    Orders are processed within{" "}
                    <strong>1–2 business days</strong> and delivered within
                    <strong>3–7 business days</strong> depending on your
                    location. We offer <strong>free shipping</strong> on all
                    orders above $50, while smaller orders will have shipping
                    fees calculated at checkout.
                  </p>
                  <p>
                    Once your order is shipped, you’ll receive an email with a{" "}
                    <strong>tracking number</strong>
                    to monitor your delivery status.
                  </p>
                  <p>
                    If you’re not completely satisfied, you can return items
                    within
                    <strong>30 days</strong> of delivery. Products must be
                    unused, in their original packaging, and with all tags
                    attached.
                  </p>
                  <p>
                    Refunds are processed to your original payment method within
                    <strong>5–10 business days</strong> after we receive your
                    return. For more details, please see our full{" "}
                    <strong>Shipping & Returns Policy</strong> page.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="reviews">
                <AccordionTrigger className="font-semibold text-gray-900 hover:text-blue-600">
                  Reviews
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed space-y-4">
                  {userReview ? (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold mb-2 text-gray-800">
                        Your Review
                      </h4>
                      <div className="flex gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <Star
                            key={r}
                            onClick={() => setRating(r)}
                            className={`h-6 w-6 cursor-pointer transition ${
                              r <= rating
                                ? "text-blue-500 fill-blue-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        onClick={handleReviewSubmit}
                        disabled={isSubmitting}
                        variant="outline"
                        className="mt-3 text-sm"
                      >
                        {isSubmitting ? "Updating..." : "Update Review"}
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold mb-2 text-gray-800">
                        Write a Review
                      </h4>
                      <div className="flex gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <Star
                            key={r}
                            onClick={() => setRating(r)}
                            className={`h-6 w-6 cursor-pointer transition ${
                              r <= rating
                                ? "text-blue-500 fill-blue-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Share your thoughts..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        onClick={handleReviewSubmit}
                        disabled={isSubmitting}
                        variant="outline"
                        className="mt-3 text-sm"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        <section className="mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 text-center">
            You Might Also Like This
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sameOtherProducts.map((product, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl bg-white transition-shadow duration-300 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-headline text-lg font-medium leading-tight">
                    <Link
                      href={`/products/${product.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.brand}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xl font-semibold text-foreground">
                      {product.price.toFixed(2)} ETB
                    </p>

                    <div className="flex items-center text-blue-500 gap-0.5">
                      <Star className="h-5 w-5 " fill="currentColor" />
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                      <Star className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => router.push(`/listing/${product.id}`)}
                      className="bg-blue-500 w-full hover:!bg-blue-400 mt-5"
                    >
                      Add To Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetailsContent;
