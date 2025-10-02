'use client'

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, FileText, ListOrdered, LogOut, Package, Printer, SendToBack, Settings } from "lucide-react";

interface SidebarProps {
    isOpen : Boolean;
    toggle : ()=>void
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


function SuperAdminSidebar({isOpen,toggle} : SidebarProps) {
    return (
        <div className={cn('fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300',isOpen ? 'w-64' : 'w-16','border-r')}
        >
            <div className="flex h-16 items-center justify-between px-4">
                <h1 className={cn('font-semibold',!isOpen && 'hidden')}>
                    Admin Panel
                </h1>
                <Button
                variant={"ghost"}
                size={"icon"}
                className="ml-auto"
                onClick={toggle}
                >
                    {isOpen ? <ChevronLeft className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
                </Button>
            </div>
        </div>
    )
}

export default SuperAdminSidebar