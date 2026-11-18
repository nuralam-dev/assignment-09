import type { AuthLayoutProps } from "@/typs";

import Link from "next/link";
import { FiTool, FiCheckCircle } from "react-icons/fi";

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f5f8f8]">

      {/* Left Section */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#092e33] p-12 text-white lg:flex">

        {/* Background Decoration */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
            <FiTool className="text-2xl" />
          </div>

          <h2 className="text-3xl font-bold">
            Fix<span className="text-orange-400">Mate</span>
          </h2>
        </Link>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            Smart Repair Service Platform
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Reliable Repairs.
            <br />
            <span className="text-orange-400">
              Better Experience.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-300">
            Connect with trusted technicians, manage your
            repair requests, and enjoy a hassle-free
            repair experience.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Find reliable repair services",
              "Track your repair progress",
              "Pay only after completion",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <FiCheckCircle className="text-xl text-orange-400" />

                <span className="text-gray-200">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-gray-400">
          © {new Date().getFullYear()} FixMate.
          All rights reserved.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center px-5 py-12 sm:px-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
}
