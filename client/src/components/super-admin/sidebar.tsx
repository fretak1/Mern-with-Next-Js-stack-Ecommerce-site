"use client";

import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ListOrdered,
  LogOut,
  Package,
  PlusCircle,
  ReceiptText,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
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
    icon: PlusCircle,
    href: "/super-admin/products/add",
  },
  {
    name: "Orders",
    icon: ReceiptText,
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
  { name: "Newsletter", icon: FileText, href: "/super-admin/newsletter" },
  {
    name: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
  {
    name: "Logout",
    icon: LogOut,
    href: "",
  },
];

function SuperAdminSidebar({ isOpen, toggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  return (
    <div
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 shadow-lg bg-gray-100
        ${isOpen ? "w-64" : "w-16"}`}
    >
      {/* Header / Logo Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        <h1
          className={`text-xl font-extrabold text-gray-900 tracking-wider transition-opacity duration-200
            ${!isOpen ? "opacity-0 hidden" : ""}`}
        >
          ADMIN PANEL
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className={`ml-auto text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors
            ${!isOpen ? "mx-auto" : ""}`}
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
            const isLogout = item.name === "Logout";
            const isActive = pathname === item.href && !isLogout;

            return (
              <div
                onClick={isLogout ? handleLogout : () => router.push(item.href)}
                key={item.name}
                className={`flex cursor-pointer items-center py-3 text-sm font-medium transition-colors duration-200
                  ${
                    isOpen
                      ? `px-6 rounded-lg mx-2
                          ${
                            isActive
                              ? "bg-blue-500 text-primary-foreground shadow-sm"
                              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                          }`
                      : `justify-center px-0
                          ${
                            isActive
                              ? "bg-blue-500 text-primary-foreground"
                              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                          }`
                  }
                  ${
                    isLogout
                      ? `mt-4 pt-4 border-t border-gray-200
                         ${
                           isOpen
                             ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                             : "text-red-600 hover:bg-red-50 hover:text-red-700"
                         }`
                      : ""
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0
                    ${!isOpen ? "mx-auto" : ""}`}
                />
                <span
                  className={`whitespace-nowrap transition-opacity duration-200
                    ${!isOpen ? "hidden" : "ml-4"}`}
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
