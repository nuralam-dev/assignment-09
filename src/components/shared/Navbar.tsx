"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX, FiTool } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "How it works", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
            <FiTool className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">FixMate</h1>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative pb-2 text-lg font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {link.name}

              {isActive(link.href) && (
                <span className="absolute left-0 top-full h-1 w-full rounded-full bg-orange-500"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right: Desktop Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/sign-in"
            className="text-lg font-semibold text-teal-800 transition hover:text-teal-600"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="rounded-xl bg-orange-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-orange-600"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl text-slate-700 md:hidden"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-base font-medium ${
                  isActive(link.href)
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-semibold text-teal-800 hover:bg-gray-50"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-orange-500 px-3 py-3 text-center text-base font-semibold text-white hover:bg-orange-600"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}