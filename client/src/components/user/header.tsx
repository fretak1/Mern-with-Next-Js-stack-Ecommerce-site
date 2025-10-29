"use client";

import {
  ArrowLeft,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
// ⭐️ UPDATED IMPORT ⭐️
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useEffect, useState, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Input } from "../ui/input";
import { useProductStore } from "@/store/useProductStore";

// --- Type Definitions ---
type Product = {
  id: string;
  name: string;
  category?: string;
  price?: number;
  images?: string[];
};

const navItems = [
  { title: "HOME", to: "/home" },
  { title: "PRODUCTS", to: "/listing" },
];
// ------------------------

function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  // ⭐️ GET PATHNAME ⭐️
  const pathname = usePathname();

  // Mobile Menu States
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
  const [showSheetDialog, setShowSheetDialog] = useState(false);

  // Cart State (Zustand store)
  const { fetchCart, items } = useCartStore();

  // Product State (Zustand store)
  const { products, getAllProducts } = useProductStore() as {
    products: Product[];
    getAllProducts: () => void;
  };

  // Search States and Ref
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { fetchCurrentUser } = useAuthStore();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // On app start, try to fetch current user (server will use httpOnly cookie)
    fetchCurrentUser();
  }, [fetchCurrentUser]);
  // --- Effects ---

  // 1. Fetch Cart
  useEffect(() => {
    if (user) fetchCart();
  }, [fetchCart, user]);

  // 2. Fetch All Products for search suggestions

  useEffect(() => {
    if (!fetched) {
      getAllProducts();
      setFetched(true);
    }
  }, [getAllProducts, fetched]);

  // 3. Manage searchText based on URL pathname (FIXED for App Router)
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== "undefined") {
      const currentPath = pathname; // Use the value from the hook

      if (currentPath.startsWith("/listing")) {
        // Case 1: On the listing page, read search term from URL
        const params = new URLSearchParams(window.location.search);
        const searchParam = params.get("search");

        const newSearchText = searchParam
          ? decodeURIComponent(searchParam)
          : "";
        setSearchText(newSearchText);

        setShowSuggestions(false);
      } else {
        // Case 2: On any other page, clear the input
        if (searchText !== "") {
          setSearchText("");
        }
        setShowSuggestions(false);
      }
    }
    // ⭐️ DEPENDENCY CHANGED TO pathname ⭐️
  }, [pathname]);

  // 4. Filter suggestions and manage visibility dynamically
  useEffect(() => {
    const query = searchText.trim().toLowerCase();

    if (query === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query)
    );

    setSuggestions(filtered.slice(0, 5));

    // Only show if results found AND input is currently focused
    if (filtered.length > 0 && inputIsFocused) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // CRITICAL DEPENDENCY: inputIsFocused ensures this runs when focus changes
  }, [searchText, products, inputIsFocused]);

  // --- Handlers ---

  const handleLogout = async () => await logout();

  const handleSelectSuggestion = (name: string) => {
    setSearchText(name);
    router.push(`/listing?search=${encodeURIComponent(name)}`);
    setSuggestions([]);
    setInputIsFocused(false);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      router.push(`/listing?search=${encodeURIComponent(searchText.trim())}`);
      setSuggestions([]);
      setInputIsFocused(false);
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  };

  const handleSearchInputFocus = () => {
    setInputIsFocused(true);
  };

  const handleSearchInputBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== searchInputRef.current) {
        setInputIsFocused(false);
        setShowSuggestions(false);
      }
    }, 150);
  };

  // --- Mobile Renderer ---
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
                    setShowSheetDialog(false);
                    router.push("/auth/login");
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
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart ({items?.length || 0})
              </Button>
            </div>
          </div>
        );
    }
  };
  // -------------------------

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-gray-50/70 backdrop-blur-md supports-[backdrop-filter]:bg-gray-200/70">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link
              className="text-3xl flex items-center gap-4 font-extrabold text-gray-900 tracking-widest"
              href="/home"
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

              {/* Search with suggestions */}
              <div className="relative flex items-center w-80">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search products..."
                    className="pl-9 pr-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all w-full"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={handleSearchInputFocus}
                    onBlur={handleSearchInputBlur}
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-5 py-2 flex items-center gap-1 shadow-sm transition-all"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>

                {/* Suggestions List - Conditional Rendering with showSuggestions */}
                {suggestions.length > 0 && showSuggestions && (
                  <ul className="absolute top-full left-0 right-[90px] bg-white border border-gray-200 mt-2 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((item) => (
                      <li
                        key={item.id}
                        // CRITICAL: Prevent the input from blurring when clicking a suggestion.
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectSuggestion(item.name)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 transition-colors duration-150"
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.price && (
                          <span className="text-sm text-gray-500">
                            ${item.price}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right-side Icons */}
            <div
              className={`hidden lg:flex items-center ${
                user ? "space-x-12" : "space-x-5"
              }`}
            >
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
