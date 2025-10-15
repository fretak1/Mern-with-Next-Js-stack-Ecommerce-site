"use client";

import { usePathname } from "next/navigation";
import Header from "../user/header";

const pathsNotShowHeaders = ["/auth", "/super-admin"];

function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const showHeader = !pathsNotShowHeaders.some((currentPath) =>
    pathName.startsWith(currentPath)
  );

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
      <main>{children}</main>
    </div>
  );
}

export default CommonLayout;
