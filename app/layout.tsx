import "./globals.css";
import { ReactNode } from "react";
import { Header } from "./components/Header";
import { ToastProvider } from "./components/Toast";

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
                <div className="card p-4 sticky top-6">
                  <h3 className="font-semibold mb-2">Quick Tips</h3>
                  <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
                    <li>
                      Upload all required documents before scheduling exams
                    </li>
                    <li>
                      Mark payments as they arrive to keep balances accurate
                    </li>
                    <li>Use month filter on dashboard for SRD totals</li>
                  </ul>
                </div>
              </aside>
              <main className="lg:col-span-9">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
