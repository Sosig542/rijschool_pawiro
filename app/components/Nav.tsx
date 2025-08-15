"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function Nav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`px-3 py-2 rounded-full transition-colors ${
        pathname === href
          ? "bg-sky-600 text-white"
          : "text-sky-700 hover:bg-sky-50"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {label}
    </Link>
  );

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/students", label: "Students" },
    { href: "/newsletters", label: "Newsletters" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 rounded-md text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Desktop navigation */}
      <nav className="hidden lg:flex gap-2 bg-white/80 backdrop-blur border rounded-full px-2 py-1 shadow-sm">
        {navLinks.map(({ href, label }) => link(href, label))}
      </nav>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 lg:hidden">
          <nav className="flex flex-col p-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  pathname === href
                    ? "bg-sky-600 text-white"
                    : "text-sky-700 hover:bg-sky-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
