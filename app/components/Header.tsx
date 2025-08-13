"use client";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";

export function Header() {
  const pathname = usePathname();
  const showNav = !(pathname === "/" || pathname.startsWith("/portal"));
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-sky-600 grid place-items-center text-white font-bold shadow-sm">
          R
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Rijschool Pawiro
        </h1>
      </div>
      {showNav ? <Nav /> : null}
    </header>
  );
}
