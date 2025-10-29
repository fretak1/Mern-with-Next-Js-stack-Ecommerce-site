"use client";

import { usePathname } from "next/navigation";
import Header from "../user/header";
import { Footer } from "../user/footer";

const pathsNotShowHeaders = ["/super-admin", "/auth"];

function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const showHeader = !pathsNotShowHeaders.some((currentPath) =>
    pathName.startsWith(currentPath)
  );

  const showFooter = !pathsNotShowHeaders.some((currentPath) =>
    pathName.startsWith(currentPath)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

export default CommonLayout;
