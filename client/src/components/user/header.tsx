"use client";

import {
  ArrowDown,
  ArrowLeft,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
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
import { Input } from "../ui/input";

const navItems = [
  { title: "HOME", to: "/" },
  { title: "PRODUCTS", to: "/listing" },
];

function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const { fetchCart, items } = useCartStore();

  useEffect(() => {
    if (user) fetchCart();
  }, [fetchCart, user]);

  async function handleLogout() {
    await logout();
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
              {user ? (
                <>
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
                </>
              ) : (
                <Button
                  onClick={() => {
                    setShowSheetDialog(false); // Close the sheet
                    router.push("/auth/login"); // Navigate to login page
                  }}
                  className="w-full justify-start mt-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                >
                  Login / Signup
                </Button>
              )}
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
                Cart ({items?.length || 0})
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-gray-50/70 backdrop-blur-md supports-[backdrop-filter]:bg-gray-200/70">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link
              className="text-3xl flex items-center gap-4 font-extrabold text-gray-900 tracking-widest"
              href="/"
            >
              <Store className="h-8 w-8 text-blue-500 stroke-blue-500" />
              <p>EthioMarket</p>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
              <nav className="flex items-center space-x-10">
                {navItems.map((item, index) => (
                  <Link
                    href={item.to}
                    key={index}
                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 uppercase relative group py-2 transition-all duration-300"
                  >
                    {item.title}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                ))}
              </nav>
              <form>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-9"
                  />
                </div>
              </form>
            </div>

            {/* Right-side Icons */}
            <div className="hidden lg:flex  items-center space-x-15">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex hover:text-white hover:bg-blue-600"
              >
                <Heart className="h-5 w-5" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="flex items-center gap-1 text-gray-800 hover:bg-transparent hover:text-gray-400"
                    >
                      <User className="h-6 w-6" />
                      <span>{user.name}</span>
                      <ChevronDown />
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
              ) : (
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2"
                >
                  Login / Signup
                </Button>
              )}

              {/* Cart */}
              <div
                className="relative cursor-pointer p-2 rounded-full group hover:bg-blue-600 transition-colors"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-6 w-6 text-gray-800 group-hover:text-white" />
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center justify-center border-2 border-white">
                  {items?.length || 0}
                </span>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center space-x-3">
              <div
                className="relative cursor-pointer p-2"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-6 w-6 text-gray-800" />
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-gray-900 text-white text-xs font-medium rounded-full flex items-center justify-center border-2 border-white">
                  {items?.length || 0}
                </span>
              </div>

              <Sheet
                open={showSheetDialog}
                onOpenChange={() => {
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
                      EthioMarket
                    </SheetTitle>
                  </SheetHeader>
                  {renderMobileMenuItems()}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
