"use client";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";

export function Header() {
  const pathname = usePathname();
  const showNav = !(
    pathname === "/" ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/instructor/login")
  );
  return (
    <header className="mb-4 sm:mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-sky-600 grid place-items-center text-white font-bold shadow-sm text-sm sm:text-base">
          R
        </div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">
          Rijschool Pawiro
        </h1>
      </div>
      {showNav ? <Nav /> : null}
    </header>
  );
}
