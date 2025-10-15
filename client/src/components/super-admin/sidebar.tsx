"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ListOrdered,
  LogOut,
  Package,
  Printer,
  SendToBack,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const menuItems = [
  {
    name: "Products",
    icon: Package,
    href: "/super-admin/products/list",
  },
  {
    name: "Add New Product",
    icon: Printer,
    href: "/super-admin/products/add",
  },
  {
    name: "Orders",
    icon: SendToBack,
    href: "/super-admin/orders",
  },
  {
    name: "Coupons",
    icon: FileText,
    href: "/super-admin/coupons/list",
  },
  {
    name: "Create Coupon",
    icon: ListOrdered,
    href: "/super-admin/coupons/add",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
  {
    name: "logout",
    icon: LogOut,
    href: "",
  },
];

function SuperAdminSidebar({ isOpen, toggle }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }
  return (
    <div
      // Background changed to Primary Blue (#2F80ED) for a branded, premium feel
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 shadow-xl",
        isOpen ? "w-64" : "w-16"
      )}
      style={{ backgroundColor: "#2F80ED" }}
    >
      {/* Header / Logo Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/20">
        <h1
          className={cn(
            "text-xl font-extrabold text-white tracking-wider transition-opacity duration-200",
            !isOpen && "opacity-0 hidden"
          )}
        >
          ADMIN PANEL
        </h1>
        <Button
          variant={"ghost"}
          size={"icon"}
          // Button uses the Warm Yellow accent color for contrast
          className={cn(
            "ml-auto text-white hover:bg-white/10",
            !isOpen && "mx-auto"
          )}
          style={{ color: "#F2C94C" }}
          onClick={toggle}
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Menu Items Container */}
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 space-y-1 py-6">
          {menuItems.map((item) => {
            // Necessary comment: Add logic here (e.g., using usePathname) to determine if link is active
            const isLogout = item.name === "logout";

            return (
              <div
                onClick={isLogout ? handleLogout : () => router.push(item.href)}
                key={item.name}
                // Styling for dark mode on a blue background
                className={cn(
                  "flex cursor-pointer items-center py-3 text-sm font-medium transition-colors duration-200",
                  // Base text style is light and subtle
                  isOpen
                    ? // Hover uses a Light Aqua accent color
                      "px-6 text-white hover:bg-[#56CCF2] hover:text-[#2F80ED] rounded-lg mx-2"
                    : "justify-center text-white/90 hover:bg-[#56CCF2] hover:text-[#2F80ED] px-0",
                  // Specific styling for Logout item
                  isLogout &&
                    "mt-4 border-t border-white/20 text-red-300 hover:text-red-500",
                  // Necessary comment: Replace 'false' with the 'isActive' check for the active class (e.g., bg-white)
                  false &&
                    "bg-white text-[#2F80ED] font-semibold shadow-inner rounded-lg mx-2" // Active link uses pure white for maximum contrast
                )}
              >
                <item.icon
                  className={cn("h-5 w-5 flex-shrink-0", !isOpen && "mx-auto")}
                />
                <span
                  className={cn(
                    "ml-4 whitespace-nowrap transition-opacity duration-200",
                    !isOpen && "hidden"
                  )}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminSidebar;
