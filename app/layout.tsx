import "./globals.css";
import { ReactNode } from "react";
import { Header } from "./components/Header";
import { ToastProvider } from "./components/Toast";
import { DynamicTips } from "./components/DynamicTips";

export const metadata = {
  title: "Rijschool Admin",
  description: "Student registrations and payment tracking",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body>
        <ToastProvider>
          <div className="container py-4 sm:py-6">
            <Header />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <aside className="hidden lg:block lg:col-span-3">
                <DynamicTips />
              </aside>
              <main className="lg:col-span-9">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
