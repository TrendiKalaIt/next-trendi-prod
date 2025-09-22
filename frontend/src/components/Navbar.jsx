"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-bold">
        <Link href="/">TrendiKala</Link>
      </div>
      <ul className="flex gap-6">
        <li><Link href="/men">Men</Link></li>
        <li><Link href="/women">Women</Link></li>
        <li><Link href="/kids">Kids</Link></li>
        <li><Link href="/sale">Sale</Link></li>
      </ul>
    </nav>
  );
}
