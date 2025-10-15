"use client";

import { ArrowLeft, Menu, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";

const navItems = [
  {
    title: "HOME",
    to: "/",
  },
  {
    title: "PRODUCTS",
    to: "/listing",
  },
];

function Header() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const { fetchCart, items } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  const renderMobileMenuItems = () => {
    switch (mobileView) {
      case "account":
        return (
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2 border-b pb-4">
              <Button
                onClick={() => setMobileView("menu")}
                variant="ghost"
                size="icon"
                className="text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h3 className="font-bold text-xl text-gray-900">Account Menu</h3>
            </div>
            <nav className="space-y-1">
              <p
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/account");
                }}
                className="block cursor-pointer w-full p-3 font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded-lg"
              >
                Your Account
              </p>
              <Button
                onClick={() => {
                  setShowSheetDialog(false);
                  setMobileView("menu");
                  handleLogout();
                }}
                className="w-full justify-start mt-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Logout
              </Button>
            </nav>
          </div>
        );

      default:
        return (
          <div className="space-y-6 pt-4">
            <div className="space-y-1 border-b pb-4">
              {navItems.map((navItem) => (
                <p
                  className="block w-full font-semibold p-3 cursor-pointer text-gray-800 hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={() => {
                    setShowSheetDialog(false);
                    router.push(navItem.to);
                  }}
                  key={navItem.title}
                >
                  {navItem.title}
                </p>
              ))}
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setMobileView("account")}
                className="w-full justify-start text-base font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                <User className="mr-2 h-5 w-5" />
                Account
              </Button>
              <Button
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/cart");
                }}
                className="w-full justify-start text-base font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Cart (2)
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <header className="sticky bg-white top-0 z-50 shadow-md border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          <Link
            className="text-3xl font-extrabold text-gray-900 tracking-widest"
            href="/"
          >
            ECOMMERCE
          </Link>

          <div className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
            <nav className="flex items-center space-x-10">
              {navItems.map((item, index) => (
                <Link
                  href={item.to}
                  key={index}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 uppercase relative group py-2 transition-all duration-300"
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div
              className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-6 w-6 text-gray-800" />
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gray-900 text-white text-xs font-medium rounded-full flex items-center justify-center border-2 border-white">
                {items?.length}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant={"ghost"}
                  className="text-gray-800 hover:bg-gray-100"
                >
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 shadow-lg">
                <DropdownMenuItem
                  onClick={() => router.push("/account")}
                  className="font-medium py-2"
                >
                  Your Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 font-medium py-2"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="lg:hidden flex items-center space-x-3">
            <div
              className="relative cursor-pointer p-2"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-6 w-6 text-gray-800" />
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gray-900 text-white text-xs font-medium rounded-full flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>

            <Sheet
              open={showSheetDialog}
              onOpenChange={() => {
                // Necessary comment: Resets mobile view state upon closing the sheet
                setShowSheetDialog(false);
                setMobileView("menu");
              }}
            >
              <Button
                onClick={() => setShowSheetDialog(!showSheetDialog)}
                size="icon"
                variant="ghost"
                className="text-gray-800 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <SheetContent side="left" className="w-full sm:max-w-xs p-6">
                <SheetHeader className="pb-4 border-b">
                  <SheetTitle className="text-3xl font-extrabold text-gray-900 tracking-widest">
                    ECOMMERCE
                  </SheetTitle>
                </SheetHeader>
                {/* Necessary comment: Renders mobile menu based on 'mobileView' state */}
                {renderMobileMenuItems()}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
