"use client";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { signOut } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const showNav = !(
    pathname === "/" ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/instructor/login")
  );

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

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
      <div className="flex items-center gap-3">
        {showNav && (
          <>
            <Nav />
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors border border-red-200 hover:border-red-300 text-sm font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
