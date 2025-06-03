/**
 * components/Layout.tsx
 *
 * Wraps pages with a Navbar and a footer placeholder.
 */

import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-100 py-4 text-center text-sm">
        © {new Date().getFullYear()} Prime Worldwide Properties
      </footer>
    </div>
  );
}