"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { FiMenu, FiX, FiTool } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "How it works", href: "/about" },
];

function AccountMenu({
  user,
  onNavigate,
}: {
  user: { name: string; email: string };
  onNavigate?: () => void;
}) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const itemClassName =
    "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-teal-50 data-highlighted:text-teal-800 [&_svg]:size-4";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message || "Please try again.");
      onNavigate?.();
    } catch {
      toast.add({
        type: "error",
        title: "Sign out failed",
        description: "Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        render={<Button variant="outline" />}
        disabled={isSigningOut}
        aria-label={`Account menu for ${user.name}`}
        className="h-auto max-w-full gap-3 rounded-xl border-gray-200 px-3 py-2 text-teal-800 hover:bg-teal-50"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 font-semibold" aria-hidden="true">
          {user.name.trim().charAt(0).toUpperCase() || "U"}
        </span>
        <span className="max-w-40 truncate">{isSigningOut ? "Signing out..." : user.name}</span>
        <ChevronDown aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-[60]">
          <Menu.Popup className="w-64 max-w-[calc(100vw-2rem)] origin-(--transform-origin) rounded-xl border border-gray-200 bg-white p-1 text-slate-700 shadow-lg outline-none transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Menu.Group>
              <Menu.GroupLabel className="px-3 py-2">
                <span className="block truncate text-sm font-semibold text-slate-800">{user.name}</span>
                <span className="block truncate text-xs font-normal text-slate-500">{user.email}</span>
              </Menu.GroupLabel>
              <Menu.Separator className="my-1 h-px bg-gray-100" />
              <Menu.LinkItem render={<Link href="/dashboard" />} closeOnClick onClick={onNavigate} className={itemClassName}>
                <LayoutDashboard aria-hidden="true" />
                Dashboard
              </Menu.LinkItem>
              <Menu.LinkItem render={<Link href="/my-profile" />} closeOnClick onClick={onNavigate} className={itemClassName}>
                <UserRound aria-hidden="true" />
                My Profile
              </Menu.LinkItem>
              <Menu.Separator className="my-1 h-px bg-gray-100" />
              <Menu.Item
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`${itemClassName} text-red-600 data-highlighted:bg-red-50 data-highlighted:text-red-700 data-disabled:opacity-50`}
              >
                <LogOut aria-hidden="true" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  // session management
  const { data: session, isPending } = authClient.useSession();
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
          {isPending ? (
            <span role="status" className="text-sm text-slate-500">Loading session...</span>
          ) : session ? (
            <AccountMenu user={session.user} />
          ) : (
            <>
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
            </>
          )}
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

            {isPending ? (
              <span role="status" className="px-3 py-2 text-sm text-slate-500">Loading session...</span>
            ) : session ? (
              <AccountMenu user={session.user} onNavigate={() => setOpen(false)} />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
