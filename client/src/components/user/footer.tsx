import Link from "next/link";
import { Github, Twitter, Instagram, Store } from "lucide-react";
import { FaTelegramPlane, FaInstagram, FaTiktok } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-4">
              <Store className="h-8 w-8 text-blue-500 stroke-blue-500" />
              <p>EthioMarket</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Modern e-commerce for modern living.
            </p>
            <div className="flex flex-col gap-3 space-x-4 ">
              <Link
                href="#"
                className="text-muted-foreground flex gap-4 hover:text-blue-500"
              >
                <FaTelegramPlane className="text-blue-500 text-3xl hover:text-blue-600 cursor-pointer transition-colors" />
                <p>Telegram</p>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground flex gap-4 hover:text-pink-600"
              >
                <FaInstagram className="text-pink-500 text-3xl hover:text-pink-600 cursor-pointer transition-colors" />
                <p>Instagram</p>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground flex gap-4 hover:text-gray-900"
              >
                <FaTiktok className="text-gray-800 text-3xl hover:text-gray-900 cursor-pointer transition-colors" />
                <p>Tiktok</p>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    Watches
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    Bags
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    Perfume
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-blue-500"
                  >
                    Shipping & Returns
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-4 md:col-span-1">
            <h3 className="font-semibold">Subscribe to our newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest product updates.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9"
                focusClass="focus-visible:border-blue-800 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                variant="default"
                className="!bg-blue-500 hover:!bg-blue-400 text-white transition-colors"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} ShopWave, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
