/**
 * components/Navbar.tsx
 *
 * Responsive Navbar with links to Home, Search by Parish, About, Contact.
 */

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="text-2xl font-bold text-charcoal">Prime Worldwide</a>
        </Link>
        <button
          className="md:hidden text-charcoal text-xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>
        <div
          className={`${
            open ? "block" : "hidden"
          } md:flex space-x-6 text-charcoal font-medium`}
        >
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/search?parish=">
            <a>Search by Parish</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </div>
      </div>
    </nav>
  );
}