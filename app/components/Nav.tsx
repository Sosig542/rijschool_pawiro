"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`px-3 py-2 rounded-full ${
        pathname === href
          ? "bg-sky-600 text-white"
          : "text-sky-700 hover:bg-sky-50"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <nav className="flex gap-2 bg-white/80 backdrop-blur border rounded-full px-2 py-1 shadow-sm">
      {link("/dashboard", "Dashboard")}
      {link("/students", "Students")}
      {link("/newsletters", "Newsletters")}
      {link("/settings", "Settings")}
    </nav>
  );
}
